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


    const inputRef = useRef<HTMLInputElement | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const lastQueryRef = useRef<string | null>(null)

    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc5MTU1MDUsImV4cCI6MTc1NzkxOTEwNSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1NzkxNTUwNSwic2NvcGUiOlsiZW1zaV9vcGVuIl19.vT30bhN0i_cq-0f8-gujNJzDuo2HN82pzdt_1NyiOkDOJfvlFAP0xAXsaC095_TGtUE9DMe1GLqTlyrOjVL-zuq_DlR3UZGkLyiPucCQpYVROzvVANl6DsjQXgT9GAgfUYoaf7yuqrFyPlSmDiWXdZen23ZtiA6Tyx8HI4fu5ezOqXJ_SgEtcWMcWlfFZoef5kO92SEkTefqSjmLMt1DHTbR_EseAdCt2mL7suMjtWwq8jzKiYevx6OUkm6Lw-hHGqI_LFa-kLHSBKmcX4X1RzMM2Y3fhSea6wJZrIeu1Hl_UiExerRBZgBZiLD2gcoUU4zSOPxqRHk9OF5Xi5L5jA"
    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        inputRef.current?.focus()
    }, [primarySelected.length, secondarySelected.length])  

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
                requestAnimationFrame(() => inputRef.current?.focus())
                return
            }
    
            let skillAdded = false
    
            if (primarySelected.length < MAX_SKILLS) {
                skillAdded = true
                const nextPrimary = [...primarySelected, { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" }]
                setPrimarySelected(nextPrimary)
                onChange?.(nextPrimary)
                onChangeBoth?.(nextPrimary, secondarySelected)
            } 
            else if (secondarySelected.length < MAX_SKILLS) {
                skillAdded = true
                const nextSecondary = [...secondarySelected, { ...item, years: item.years ?? 0, proficiency: item.proficiency ?? "Novice" }]
                setSecondarySelected(nextSecondary)
                onChangeBoth?.(primarySelected, nextSecondary)
            } 
            else {
                setError(`You can select up to ${MAX_SKILLS} primary and ${MAX_SKILLS} secondary skills`)
            }
    
            if (skillAdded) {
                setLocalSeed((prev) => prev.filter((s) => s.id !== item.id))
                setNumselected((n) => n + 1)
            }
            
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

            <h3 style={{
                marginTop: "10px"
            }}>Select your top 5 skills</h3>

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
                    ref={inputRef}
                    value={query}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
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
                    Mention upto 5 primary Skills
                </h3>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {primarySelected.map((s) => (
                    <div
                        key={s.id}
                        className="w-full max-w-xl rounded-xl bg-white border border-red-200 shadow-sm p-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-red-900">{s.name}</span>
                            <button
                                type="button"
                                className="rounded-full border border-red-300 px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                                onClick={() => removeSkill(s.id)}
                                onMouseDown={(e) => e.preventDefault()}
                                aria-label={`Remove ${s.name}`}
                                title="Remove"
                            >
                                x
                            </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-2 text-[13px] text-red-700">
                                <span>Years</span>
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
                                    className="h-8 rounded-md border border-red-200 bg-white px-2 text-xs text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
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
                            <label className="flex items-center gap-2 text-[13px] text-red-700">
                                <span>Proficiency</span>
                                <select
                                    value={s.proficiency || "Novice"}
                                    onChange={(e) => {
                                        const proficiency = e.target.value as SkillItem["proficiency"]
                                        setPrimarySelected((prev) => {
                                            const next = prev.map((x) =>
                                                x.id === s.id ? { ...x, proficiency } : x
                                            )
                                            onChange?.(next)
                                            onChangeBoth?.(next, secondarySelected)
                                            return next
                                        })
                                    }}
                                    className="h-8 rounded-md border border-red-200 bg-white px-2 text-xs text-red-800 focus:outline-none focus:ring-2 focus:ring-red-200"
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
                        </div>
                        <div className="mt-3">
                            <label className="block text-[13px] text-red-700 mb-1">Certification link</label>
                            <input
                                value={(s as any).certification || ""}
                                onChange={(e) => {
                                    const certification = e.target.value
                                    setPrimarySelected((prev) => {
                                        const next = prev.map((x) =>
                                            x.id === s.id ? { ...x, certification } : x
                                        )
                                        onChange?.(next)
                                        onChangeBoth?.(next, secondarySelected)
                                        return next
                                    })
                                }}
                                placeholder="Enter the certificate url"
                                className="w-full h-9 rounded-md border border-red-200 bg-white px-3 text-sm text-red-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                                aria-label={`Certification for ${s.name}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {secondarySelected.length > 0 && (
                <h3
                    style={{
                        marginTop: "14px",
                    }}
                >
                    Mention upto 5 Secondary Skills
                </h3>
            )}

            {secondarySelected.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {secondarySelected.map((s) => (
                        <div
                            key={s.id}
                            className="w-full max-w-xl rounded-xl bg-white border border-red-200 shadow-sm p-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-red-500">{s.name}</span>
                                <button
                                    type="button"
                                    className="rounded-full border border-red-300 px-2 text-xs text-red-400 hover:bg-red-50"
                                    onClick={() => removeSkill(s.id)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    aria-label={`Remove ${s.name}`}
                                    title="Remove"
                                >
                                    x
                                </button>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2 text-[13px] text-red-400">
                                    <span>Years</span>
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
                                        className="h-8 rounded-md border border-red-200 bg-white px-2 text-xs text-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
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

                                <label className="flex items-center gap-2 text-[13px] text-red-400">
                                    <span>Proficiency</span>
                                    <select
                                        value={s.proficiency || "Novice"}
                                        onChange={(e) => {
                                            const proficiency = e.target.value as SkillItem["proficiency"]
                                            setSecondarySelected((prev) => {
                                                const next = prev.map((x) =>
                                                    x.id === s.id ? { ...x, proficiency } : x
                                                )
                                                onChangeBoth?.(primarySelected, next)
                                                return next
                                            })
                                        }}
                                        className="h-8 rounded-md border border-red-200 bg-white px-2 text-xs text-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
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
                            </div>

                            <div className="mt-3">
                                <label className="block text-[13px] text-indigo-700 mb-1">Certification link</label>
                                <input
                                    onChange={(e) => {
                                        const certification = e.target.value
                                        setSecondarySelected((prev) => {
                                            const next = prev.map((x) =>
                                                x.id === s.id ? { ...x, certification } : x
                                            )
                                            onChangeBoth?.(primarySelected, next)
                                            return next
                                        })
                                    }}
                                    placeholder="Enter the certificate url"
                                    className="w-full h-9 rounded-md border border-red-200 bg-white px-3 text-sm text-red-500 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                                    aria-label={`Certification for ${s.name}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
