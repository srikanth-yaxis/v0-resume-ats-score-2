"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type TitleItem = { id: string; name: string };
type ExperienceRange = "0-2" | "3-5" | "6-10" | "10+";
type SelectedTitle = { id: string; name: string; experience?: ExperienceRange };

function useDebouncedValue<T>(value: T, delayMs = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

export interface TitleSelectorProps {
    token?: string;
    minChars?: number;
    limit?: number;
    page?: number;
    placeholder?: string;
    className?: string;
    onChange?: (title: SelectedTitle | null) => void;
}

const API_BASE = "https://emsiservices.com/titles/versions/latest/titles";

export default function TitleSelector({
    minChars = 2,
    limit = 20,
    page = 1,
    placeholder = "Search job titles (e.g. Solution Architect)",
    onChange,
}: TitleSelectorProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<TitleItem[]>([]);
    const [selected, setSelected] = useState<SelectedTitle | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const lastQueryRef = useRef<string | null>(null);

    const [title, setTitle] = useState<string | null>("Software Engineer");

    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc5NDIwODMsImV4cCI6MTc1Nzk0NTY4MywiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1Nzk0MjA4Mywic2NvcGUiOlsiZW1zaV9vcGVuIl19.AfT1XR-kWMIFIe590LUSxZ0VDmCaPnt_IsZ9CJSGaVrpeWjPGKV0QmSsQlzyjWYUmUQmKBqR7MwWOfvWkjHYZjSgTa-AZjB_wuQ59yXe1_bp9SQvsuivISy2ZXwiRK8MmFqOAVLoqJYJr2IlPqRNQIRIbcva904d2huAob1OHK4EDfELDdDRLamkhoQSlnyl5ERbDm7oNsm2HzTXykiRiiy0ORNFecRvA7W0KnYMuDctke52WV5Fr2GCe6CBim3WHnPoooa8IjywwKFchbqbOVZp4jcs0aSc78wH7aHnm81iVmWgiIxd9cbpgT8kDXfuLUunPn4q29MXFwiXsGhpXA"

    const authHeader = useMemo(() => {
        if (!token) return "";
        return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
    }, [token]);

    const debouncedQuery = useDebouncedValue(query.trim(), 350);
    const showPrefilled = !!title && title.trim().length > 0;

    const fetchTitles = useCallback(
        async (search: string) => {
            if (lastQueryRef.current === search) return;
            lastQueryRef.current = search;

            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const url = new URL(API_BASE);
            url.searchParams.set("q", search);
            url.searchParams.set("limit", String(limit));
            url.searchParams.set("page", String(page));

            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        ...(authHeader ? { Authorization: authHeader } : {}),
                    },
                    signal: controller.signal,
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
                }
                const json = await res.json();
                const items: TitleItem[] = Array.isArray(json?.data)
                    ? json.data
                        .map((d: any) => ({
                            id: d?.id != null ? String(d.id) : undefined,
                            name: d?.name != null ? String(d.name) : undefined,
                        }))
                        .filter((x: any) => x.id && x.name)
                    : [];

                setSuggestions(items);
                setOpen(true);
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e?.message || "Something went wrong");
                setSuggestions([]);
                setOpen(true);
            } finally {
                setIsLoading(false);
            }
        },
        [authHeader, limit, page],
    );

    useEffect(() => {
        // If a prefilled title exists, skip searching entirely.
        if (showPrefilled) {
            setSuggestions([]);
            setOpen(false);
            setIsLoading(false);
            setError(null);
            return;
        }

        if (debouncedQuery.length < minChars) {
            setSuggestions([]);
            setOpen(false);
            setIsLoading(false);
            setError(null);
            return;
        }
        fetchTitles(debouncedQuery);
    }, [debouncedQuery, minChars, fetchTitles, showPrefilled]);

    const selectTitle = useCallback(
        (item: TitleItem) => {
            const newSelected = { ...item };
            setSelected(newSelected);
            onChange?.(newSelected);
            setQuery("");
            setSuggestions([]);
            setOpen(false);
        },
        [onChange],
    );

    const removeTitle = useCallback(() => {
        if (showPrefilled) {
            setTitle(null);
        }
        setSelected(null);
        onChange?.(null);
        requestAnimationFrame(() => inputRef.current?.focus());
    }, [onChange, showPrefilled]);

    const setExperience = useCallback(
        (experience: ExperienceRange) => {
            const base = selected ?? (showPrefilled && title ? { id: "prefilled", name: title } : null);
            if (base) {
                const updated = { ...base, experience };
                setSelected(updated);
                onChange?.(updated);
            }
        },
        [selected, onChange, showPrefilled, title],
    );

    return (
        <div className={`w-full mt-5`}>
            <label className="block text-l font-medium text-gray-700 mb-2">Job Title</label>
            {!showPrefilled && !selected ? (
                <div className="relative w-full max-w-[720px]">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpen(true);
                        }}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[#e44126]"
                    />

                    {open && (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                            {isLoading ? (
                                <div className="p-3 text-sm text-gray-500">Searching…</div>
                            ) : error ? (
                                <div className="p-3 text-sm text-red-600">{error}</div>
                            ) : suggestions.length === 0 && debouncedQuery.length >= minChars ? (
                                <div className="p-3 text-sm text-gray-500">No results</div>
                            ) : (
                                <ul role="listbox" className="max-h-72 overflow-auto py-1">
                                    {suggestions.map((item) => (
                                        <li
                                            key={item.id}
                                            role="option"
                                            aria-selected={false}
                                            className="cursor-pointer px-4 py-2 hover:bg-[#e44126]/10"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => selectTitle(item)}
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
            ) : (
                <div className="flex gap-4 w-full">
                    <div className="flex-1 max-w-4xl rounded-xl bg-gradient-to-br from-white to-[#e44126]/5 border-2 border-[#e44126]/20 shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex-1 min-w-0">
                                <h3
                                    className="text-xl font-bold text-[#e44126] mb-1 truncate"
                                    title={showPrefilled ? title! : selected!.name}
                                >
                                    {showPrefilled ? title : selected!.name}
                                </h3>
                                <p className="text-sm text-[#e44126]/70 font-medium">Selected Job Title</p>
                            </div>
                            <div className="ml-4">
                                <button
                                    type="button"
                                    className="rounded-lg border-2 border-[#e44126]/30 px-4 py-2 text-sm font-medium text-[#e44126] hover:bg-[#e44126]/10 hover:border-[#e44126]/50 transition-all duration-200 shadow-sm"
                                    onClick={removeTitle}
                                    aria-label={`Remove ${showPrefilled ? title! : selected!.name}`}
                                    title="Remove title"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="max-w-lg">
                            <label htmlFor="industry" className="block mb-1 text-sm font-medium text-gray-700">
                                Total year of experience in this title
                            </label>
                            <input
                                id="industry"
                                type="number"
                                placeholder="Enter your preferred industry"
                                className="block w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}