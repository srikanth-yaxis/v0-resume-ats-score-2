"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type SkillItem = { id: string; name: string; years?: number; proficiency?: "Novice" | "Intermediate" | "Advanced" }

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

const API_BASE = "https://api.lightcast.io/skills/versions/9.34/skills"
const MAX_SKILLS = 5

export interface SkillSelectorProps {
  token?: string
  initialSkills?: SkillItem[]
  onChange?: (skills: SkillItem[]) => void
  onChangeBoth?: (primary: SkillItem[], secondary: SkillItem[]) => void
  onCertChange?: (cert: { name: string; url: string }) => void
  debounceMs?: number
  minChars?: number
  placeholder?: string
  className?: string
  seedQuery?: string
  prefetchOnMount?: boolean
  seedItems?: SkillItem[]
}

export default function SkillSelector({
  initialSkills = [],
  onChange,
  onChangeBoth,
  onCertChange,
  debounceMs = 350,
  minChars = 2,
  placeholder = "Search skills (e.g., CI/CD)",
  className = "",
  seedQuery = "pipe",
  prefetchOnMount = true,
  seedItems = [],
}: SkillSelectorProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<SkillItem[]>([])
  const [open, setOpen] = useState(false)
  const [primarySelected, setPrimarySelected] = useState<SkillItem[]>(initialSkills)
  const [secondarySelected, setSecondarySelected] = useState<SkillItem[]>([])
  const [numSelected, setNumselected] = useState(0)
  const [localSeed, setLocalSeed] = useState<SkillItem[]>(seedItems)
  const [certName, setCertName] = useState("")
  const [certUrl, setCertUrl] = useState("")

  const inputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastQueryRef = useRef<string | null>(null)

  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc2NzM1NTMsImV4cCI6MTc1NzY3NzE1MywiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1NzY3MzU1Mywic2NvcGUiOlsiZW1zaV9vcGVuIl19.Rge362wr4_CPUCBA7UNTrpNeOXxQNx9bzHIXI6qG1hfnUsgx0hJhj2y7vlaLBVIF3B2alXuQlNxIGsw23CMT4eudhBAODNXh53RoOWIEKTc21-_-rkeArb6zRnJhWn1W95WylLXs_zK5M3XQuYX912dWsUPAaB7JlCGJPUF-PPUb3Z7sm7qknPY3wgdOTxGOkDTdI0PWRnAWqzs9ZZhHXiwrQaVaU0tOgvA9qo__HEt6hbp7NM8Xho207Aw2gRn_0onyXuV6iIwghihmpMDZMjvVVksOemnwt-eKf75wj2gKeCXLke5SMw_Ttcit63-QEb5H4Tsw8W4oxnBaQczm-g"
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [primarySelected.length, secondarySelected.length])

  useEffect(() => {
    setLocalSeed(seedItems)
  }, [seedItems])

  const authHeader = useMemo(() => {
    if (!token) return ""
    return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`
  }, [token])

  const debouncedQuery = useDebouncedValue(query.trim(), debounceMs)

  const fetchSkills = useCallback(
    async (search: string) => {
      if (lastQueryRef.current === search) {
        return
      }
      lastQueryRef.current = search
      if (!authHeader) {
        setSuggestions([])
        setError("Missing API token")
        setOpen(true)
        return
      }

      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const url = new URL(API_BASE)
      if (search.length >= minChars) url.searchParams.set("q", search)
      else url.searchParams.set("q", seedQuery)
      url.searchParams.set("limit", "20")

      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: authHeader,
          },
          signal: controller.signal,
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Request failed (${res.status}): ${text || res.statusText}`)
        }
        const json = await res.json()
        const arr = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.skills)
            ? json.skills
            : Array.isArray(json?.results)
              ? json.results
              : []
        const items: SkillItem[] = arr
          .map((d: any) => ({
            id: (d && (d.id || d.uuid || d.code)) != null ? String(d.id || d.uuid || d.code) : undefined,
            name: (d && (d.name || d.title)) != null ? String(d.name || d.title) : undefined,
          }))
          .filter((x: any) => x.id && x.name)

        setSuggestions(items)
        setOpen(true)
      } catch (e: any) {
        if (e?.name === "AbortError") return
        setError(e?.message || "Something went wrong")
        setSuggestions([])
        setOpen(true)
      } finally {
        setIsLoading(false)
      }
    },
    [authHeader, minChars, seedQuery],
  )

  // Seed chips on mount; only prefetch if no seed and token provided
  useEffect(() => {
    if (localSeed && localSeed.length > 0) {
      setSuggestions([])
      setOpen(false)
    } else if (prefetchOnMount && authHeader) {
      fetchSkills("")
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.length < minChars) {
      setSuggestions([])
      setOpen(false)
      setIsLoading(false)
      setError(null)
      return
    }
    fetchSkills(debouncedQuery)
  }, [debouncedQuery, minChars, fetchSkills])

  const addSkill = useCallback(
    (item: SkillItem) => {
      // remove from seed if present
      setLocalSeed((prev) => prev.filter((s) => s.id !== item.id))

      setNumselected((n) => n + 1)

      // decide target list: fill primary up to MAX_SKILLS, then secondary
      setPrimarySelected((prevPrimary) => {
        if (prevPrimary.length < MAX_SKILLS) {
          const exists = prevPrimary.some((s) => s.id === item.id)
          const nextPrimary = exists ? prevPrimary : [...prevPrimary, { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" }]
          onChange?.(nextPrimary)
          onChangeBoth?.(nextPrimary, secondarySelected)
          return nextPrimary
        }
        return prevPrimary
      })

      setSecondarySelected((prevSecondary) => {
        // Only add to secondary if primary is full and secondary has room
        if (primarySelected.length >= MAX_SKILLS) {
          if (prevSecondary.length >= MAX_SKILLS) {
            setError(`You can select up to ${MAX_SKILLS} secondary skills`)
            setOpen(false)
            return prevSecondary
          }
          const exists = prevSecondary.some((s) => s.id === item.id)
          const nextSecondary = exists ? prevSecondary : [...prevSecondary, { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" }]
          onChangeBoth?.(primarySelected, nextSecondary)
          return nextSecondary
        }
        return prevSecondary
      })
      setQuery("")
      setSuggestions([])
      setOpen(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [onChange, onChangeBoth, primarySelected, secondarySelected],
  )

  const removeSkill = useCallback(
    (id: string) => {
      setPrimarySelected((prev) => {
        const next = prev.filter((s) => s.id !== id)
        onChange?.(next)
        onChangeBoth?.(next, secondarySelected)
        return next
      })
      setSecondarySelected((prev) => {
        const next = prev.filter((s) => s.id !== id)
        onChangeBoth?.(primarySelected, next)
        return next
      })
      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [onChange, onChangeBoth, primarySelected, secondarySelected],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
  }

  const handleBlur = () => {
    // Allow focus to move to other controls (e.g., years select) without forcing re-focus
  }

  const wrapperClass = "max-w-2xl w-full " + className

  return (
    <div className={wrapperClass}>
      {/* Search input moved below seedItems */}

      <h3 style={{
        marginTop: "10px"
      }}>Select your top 5 Primary skills</h3>
      
      <div className="mt-5 flex flex-wrap gap-2">
        {localSeed.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800 border border-indigo-200"
          >
            {s.name}
            <button
              type="button"
              className="rounded-full border border-indigo-300 px-2 text-xs text-indigo-700 hover:bg-indigo-100"
              onClick={() => addSkill(s)}
              onMouseDown={(e) => e.preventDefault()}
              aria-label={`Add ${s.name}`}
              title="Add"
            >
              +
            </button>
          </span>
        ))}
      </div>

      <div className="relative mt-6">
        <input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {isLoading ? (
              <div className="p-3 text-sm text-gray-500">Searching…</div>
            ) : error ? (
              <div className="p-3 text-sm text-red-600">{error}</div>
            ) : suggestions.length === 0 && query.trim().length >= minChars ? (
              <div className="p-3 text-sm text-gray-500">No results</div>
            ) : (
              <ul role="listbox" className="max-h-72 overflow-auto py-1">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={false}
                    className="cursor-pointer px-4 py-2 hover:bg-indigo-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addSkill(item)}
                    title={item.name}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {primarySelected.length > 0 && (
        <h3
          style={{
            marginTop: "10px",
          }}
        >
          Primary Skills
        </h3>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {primarySelected.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-sm text-indigo-900 border border-indigo-200 shadow-sm"
          >
            <span className="inline-flex items-center gap-2 pr-2">
              <span className="font-medium">{s.name}</span>
             
            </span>
            <span className="mx-2 h-5 w-px bg-indigo-200" />
            <span className="inline-flex items-center gap-2 pl-1">
              <span className="text-[11px] text-indigo-700">Exp</span>
              <select
                value={typeof s.years === "number" ? s.years : 0}
                onChange={(e) => {
                  const years = Number(e.target.value)
                  setPrimarySelected((prev) => {
                    const next = prev.map((x) => (x.id === s.id ? { ...x, years } : x))
                    onChange?.(next)
                    onChangeBoth?.(next, secondarySelected)
                    return next
                  })
                }}
                className="ml-1 h-7 rounded-md border border-indigo-200 bg-white px-2 text-xs text-indigo-800"
                aria-label={`Years of experience for ${s.name}`}
                title="Years of experience"
              >
                {Array.from({ length: 21 }).map((_, i) => (
                  <option key={i} value={i}>{i}y</option>
                ))}
              </select>
              <span className="text-[11px] text-indigo-700 ml-2">Proficiency</span>
              <select
                value={s.proficiency || "Novice"}
                onChange={(e) => {
                  const proficiency = e.target.value as SkillItem["proficiency"]
                  setPrimarySelected((prev) => {
                    const next = prev.map((x) => (x.id === s.id ? { ...x, proficiency } : x))
                    onChange?.(next)
                    onChangeBoth?.(next, secondarySelected)
                    return next
                  })
                }}
                className="ml-1 h-7 rounded-md border border-indigo-200 bg-white px-2 text-xs text-indigo-800"
                aria-label={`Proficiency for ${s.name}`}
                title="Proficiency"
              >
                {(["Novice","Intermediate","Advanced"] as const).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {/* <span className="mx-2 h-5 w-px bg-indigo-200" /> */}
              <button
                type="button"
                className="rounded-full border border-indigo-300 px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                onClick={() => removeSkill(s.id)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={`Remove ${s.name}`}
                title="Remove"
              >
                x
              </button>
            </span>
          </span>
        ))}
      </div>

      {secondarySelected.length > 0 && (
        <h3
          style={{
            marginTop: "14px",
          }}
        >
          Secondary Skills
        </h3>
      )}

      {secondarySelected.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {secondarySelected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center rounded-lg bg-white px-2 py-1 text-sm text-indigo-900 border border-indigo-200 shadow-sm"
            >
              <span className="inline-flex items-center gap-2 pr-2">
                <span className="font-medium">{s.name}</span>
              
              </span>
              <span className="mx-2 h-5 w-px bg-indigo-200" />
              <span className="inline-flex items-center gap-2 pl-1">
                <span className="text-[11px] text-indigo-700">Exp</span>
                <select
                  value={typeof s.years === "number" ? s.years : 0}
                  onChange={(e) => {
                    const years = Number(e.target.value)
                    setSecondarySelected((prev) => {
                      const next = prev.map((x) => (x.id === s.id ? { ...x, years } : x))
                      onChangeBoth?.(primarySelected, next)
                      return next
                    })
                  }}
                  className="ml-1 h-7 rounded-md border border-indigo-200 bg-white px-2 text-xs text-indigo-800"
                  aria-label={`Years of experience for ${s.name}`}
                  title="Years of experience"
                >
                  {Array.from({ length: 21 }).map((_, i) => (
                    <option key={i} value={i}>{i}y</option>
                  ))}
                </select>
                <span className="text-[11px] text-indigo-700 ml-2">Proficiency</span>
                <select
                  value={s.proficiency || "Novice"}
                  onChange={(e) => {
                    const proficiency = e.target.value as SkillItem["proficiency"]
                    setSecondarySelected((prev) => {
                      const next = prev.map((x) => (x.id === s.id ? { ...x, proficiency } : x))
                      onChangeBoth?.(primarySelected, next)
                      return next
                    })
                  }}
                  className="ml-1 h-7 rounded-md border border-indigo-200 bg-white px-2 text-xs text-indigo-800"
                  aria-label={`Proficiency for ${s.name}`}
                  title="Proficiency"
                >
                  {(["Novice","Intermediate","Advanced"] as const).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="rounded-full border border-indigo-300 px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                  onClick={() => removeSkill(s.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={`Remove ${s.name}`}
                  title="Remove"
                >
                  x
                </button>
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Certification Name</label>
          <input
            value={certName}
            onChange={(e) => {
              const v = e.target.value
              setCertName(v)
              onCertChange?.({ name: v, url: certUrl })
            }}
            placeholder="e.g., AWS Certified Solutions Architect"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Certification URL</label>
          <input
            value={certUrl}
            onChange={(e) => {
              const v = e.target.value
              setCertUrl(v)
              onCertChange?.({ name: certName, url: v })
            }}
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}

