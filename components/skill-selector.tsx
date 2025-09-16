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
  debounceMs = 350,
  minChars = 2,
  placeholder = "Search skills",
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
  const [localSeed, setLocalSeed] = useState<SkillItem[]>(() => seedItems)

  // 🔹 search input only
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastQueryRef = useRef<string | null>(null)

  // 🔹 per-skill upload state
  const [fileBySkill, setFileBySkill] = useState<Record<string, File | null>>({})
  const [uploadedNameBySkill, setUploadedNameBySkill] = useState<Record<string, string>>({})
  const [statusBySkill, setStatusBySkill] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({})
  const [errorBySkill, setErrorBySkill] = useState<Record<string, string | null>>({})

  const handlePick = (skillId: string) => {
    const el = document.getElementById(`resume-upload-${skillId}`) as HTMLInputElement | null
    el?.click()
  }

  const onInputChange = (skillId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setUploadedNameBySkill((prev) => ({ ...prev, [skillId]: "" }))
    setErrorBySkill((prev) => ({ ...prev, [skillId]: null }))

    if (!f) {
      setFileBySkill((prev) => ({ ...prev, [skillId]: null }))
      return
    }
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorBySkill((prev) => ({ ...prev, [skillId]: "Only PDF files are allowed." }))
      setFileBySkill((prev) => ({ ...prev, [skillId]: null }))
      return
    }
    setFileBySkill((prev) => ({ ...prev, [skillId]: f }))
  }

  async function uploadFile(skillId: string) {
    const file = fileBySkill[skillId]
    if (!file) return
    setStatusBySkill((p) => ({ ...p, [skillId]: "uploading" }))
    setErrorBySkill((p) => ({ ...p, [skillId]: null }))
    try {
      const url = "/api/upload"
      const form = new FormData()
      form.append("file", file)
      const res = await fetch(url, { method: "POST", body: form })
      if (!res.ok) throw new Error(`Upload failed (${res.status})`)
      setStatusBySkill((p) => ({ ...p, [skillId]: "success" }))
      setUploadedNameBySkill((p) => ({ ...p, [skillId]: file.name }))
      // If your API returns a URL, you can call onCertChange here with it (per-skill).
      // const { url: uploadedUrl } = await res.json()
      // onCertChange?.({ name: file.name, url: uploadedUrl })
    } catch (e: any) {
      setStatusBySkill((p) => ({ ...p, [skillId]: "error" }))
      setErrorBySkill((p) => ({ ...p, [skillId]: e?.message || "Upload failed" }))
    }
  }

  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc5OTg0NzksImV4cCI6MTc1ODAwMjA3OSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1Nzk5ODQ3OSwic2NvcGUiOlsiZW1zaV9vcGVuIl19.rXAqpW1zggK6a-AnRmR90L_ecbDOqMhY3EzBVYWfNhDhQkOpFUUqWt0iJcDN1S3fRPeuhH4JB-5FYeXbLDr38byklFnC90yIP-rxjw4p3C7YEAVwN9AGXkJJmnW4sMulUdrVpXIWIXt2CT_qC_QY-w-boieV31RvW3lrEstAunZrDQzoJ-udeaYkfYo9rHY2CsBNdK_6KwyJ2GE1yrN25U3jE0gB8ZH9J9x98llWTTEzrkh23rusvXWNUT5Gv8rA-SE8MZhYApAQY2BOpuProiLJ8TovNqvGjoooxFd2p3F_jZAHMRwdpGUvCkTENtK_Javv5c8vHJ5pSPi8FVQPdQ"

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [primarySelected.length, secondarySelected.length])

  const authHeader = useMemo(() => {
    if (!token) return ""
    return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`
  }, [token])

  const debouncedQuery = useDebouncedValue(query.trim(), debounceMs)

  const fetchSkills = useCallback(
    async (search: string) => {
      if (lastQueryRef.current === search) return
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
          headers: { Accept: "application/json", Authorization: authHeader },
          signal: controller.signal,
        })
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
      const existsInPrimary = primarySelected.some((s) => s.id === item.id)
      const existsInSecondary = secondarySelected.some((s) => s.id === item.id)

      if (existsInPrimary || existsInSecondary) {
        setError("This skill is already selected")
        setQuery("")
        setSuggestions([])
        setOpen(false)
        requestAnimationFrame(() => searchInputRef.current?.focus())
        return
      }

      let skillAdded = false

      if (primarySelected.length < MAX_SKILLS) {
        skillAdded = true
        const nextPrimary = [
          ...primarySelected,
          { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" },
        ]
        setPrimarySelected(nextPrimary)
        onChange?.(nextPrimary)
        onChangeBoth?.(nextPrimary, secondarySelected)
      } else if (secondarySelected.length < MAX_SKILLS) {
        skillAdded = true
        const nextSecondary = [
          ...secondarySelected,
          { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" },
        ]
        setSecondarySelected(nextSecondary)
        onChangeBoth?.(primarySelected, nextSecondary)
      }

      if (skillAdded) {
        setLocalSeed((prev) => prev.filter((s) => s.id !== item.id))
        setNumselected((n) => n + 1)
      }

      setQuery("")
      setSuggestions([])
      setOpen(false)
      requestAnimationFrame(() => searchInputRef.current?.focus())
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
      // clear any per-skill upload state too
      setFileBySkill((p) => {
        const { [id]: _, ...rest } = p
        return rest
      })
      setUploadedNameBySkill((p) => {
        const { [id]: _, ...rest } = p
        return rest
      })
      setStatusBySkill((p) => {
        const { [id]: _, ...rest } = p
        return rest
      })
      setErrorBySkill((p) => {
        const { [id]: _, ...rest } = p
        return rest
      })
      requestAnimationFrame(() => searchInputRef.current?.focus())
    },
    [onChange, onChangeBoth, primarySelected, secondarySelected],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
  }

  const wrapperClass = "max-w-2xl w-full " + className

  return (
    <div className={wrapperClass}>
      <h3 style={{ marginTop: "10px" }}>Select your top 5 skills</h3>

      <div className="mt-5 flex flex-wrap gap-2">
        {localSeed.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-red-400 border border-red-300"
          >
            {s.name}
            <button
              type="button"
              className="rounded-full border border-red-300 px-2 text-xs text-red-700 hover:bg-indigo-100"
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
          ref={searchInputRef}
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-red-200"
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
        <h3 style={{ marginTop: "10px" }}>Mention upto 5 primary Skills</h3>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3">
        {primarySelected.map((s) => {
          const file = fileBySkill[s.id] || null
          const uploadedName = uploadedNameBySkill[s.id] || ""
          const status = statusBySkill[s.id] || "idle"
          const uploadErr = errorBySkill[s.id] || null

          return (
            <div key={s.id} className="w-full rounded-xl bg-white border-2 border-[#e44126]/20 shadow-sm p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-[#e44126] truncate flex-1 min-w-[160px]">
                  {s.name}
                </span>

                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="font-medium text-[#e44126]">Exp</span>
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
                    className="h-9 rounded-lg border-2 border-orange-200/80 bg-white px-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e44126]/30 focus:border-[#e44126]/60"
                    aria-label={`Years of experience for ${s.name}`}
                    title="Years of experience"
                  >
                    {Array.from({ length: 21 }).map((_, i) => (
                      <option key={i} value={i}>
                        {i}y
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <span className="font-medium text-[#e44126]">Proficiency</span>
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
                    className="h-9 rounded-lg border-2 border-orange-200/80 bg-white px-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#e44126]/30 focus:border-[#e44126]/60"
                    aria-label={`Proficiency for ${s.name}`}
                    title="Proficiency"
                  >
                    {(["Novice", "Intermediate", "Advanced"] as const).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  className="ml-auto shrink-0 rounded-full border-2 border-[#e44126]/30 w-7 h-7 leading-none text-xs font-semibold text-[#e44126] hover:bg-[#e44126]/10 hover:border-[#e44126]/50"
                  onClick={() => removeSkill(s.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={`Remove ${s.name}`}
                  title="Remove"
                >
                  ×
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    value={(s as any).certification || ""}
                    onChange={(e) => {
                      const certification = e.target.value
                      setPrimarySelected((prev) => {
                        const next = prev.map((x) => (x.id === s.id ? { ...x, certification } : x))
                        onChange?.(next)
                        onChangeBoth?.(next, secondarySelected)
                        return next
                      })
                    }}
                    placeholder="Certification URL"
                    className="h-10 w-full rounded-lg border-2 border-orange-200/80 bg-white px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e44126]/30 focus:border-[#e44126]/60"
                    aria-label={`Certification link for ${s.name}`}
                  />
                </div>

                <div className="flex justify-center text-xs font-bold text-gray-400">OR</div>

                <div className="flex items-center gap-2">
                  {/* 🔹 hidden file input unique per skill */}
                  <input
                    id={`resume-upload-${s.id}`}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => onInputChange(s.id, e)}
                    className="hidden"
                  />

                  {/* Triggers only this skill's input */}
                  <button
                    type="button"
                    onClick={() => handlePick(s.id)}
                    className="h-10 w-full md:w-auto rounded-lg border-2 border-[#e44126]/30 px-4 text-sm font-medium text-[#e44126] bg-white hover:bg-[#e44126]/10 hover:border-[#e44126]/50 transition"
                    title="Choose certificate PDF"
                  >
                    Upload certificate
                  </button>

                  {/* Optionally show an explicit upload action */}
                  {/* <button
                    type="button"
                    disabled={!file}
                    onClick={() => uploadFile(s.id)}
                    className="h-10 md:w-auto rounded-lg border-2 border-[#e44126]/30 px-4 text-sm font-medium text-[#e44126] bg-white hover:bg-[#e44126]/10 hover:border-[#e44126]/50 transition disabled:opacity-50"
                  >
                    Save
                  </button> */}

                  <div className="text-[11px] text-gray-600">
                    {uploadedName && status === "success" && (
                      <span className="text-[#e44126]">Uploaded: {uploadedName}</span>
                    )}
                    {!uploadedName && file && status !== "uploading" && <span>Selected: {file.name}</span>}
                    {uploadErr && <span className="text-red-600">{uploadErr}</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {secondarySelected.length > 0 && (
        <>
          <h3 style={{ marginTop: "14px" }}>Mention upto 5 Secondary Skills</h3>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {secondarySelected.map((s) => (
              <div key={s.id} className="w-full rounded-xl bg-white border-2 border-[#e44126]/20 shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-[#e44126] truncate flex-1 min-w-[160px]">
                    {s.name}
                  </span>
                  <button
                    type="button"
                    className="ml-auto shrink-0 rounded-full border-2 border-[#e44126]/30 w-7 h-7 leading-none text-xs font-semibold text-[#e44126] hover:bg-[#e44126]/10 hover:border-[#e44126]/50"
                    onClick={() => removeSkill(s.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label={`Remove ${s.name}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}