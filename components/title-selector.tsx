"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type TitleItem = { id: string; name: string };
type SelectedTitle = { id: string; name: string; experience?: "0-1" | "1-2" | "2-3" | "3-4" | "4-5" | "5-6" | "6-7" | "7-8" | "8-9" | "10+" };

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
  className = "",
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

  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc5MTU1MDUsImV4cCI6MTc1NzkxOTEwNSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1NzkxNTUwNSwic2NvcGUiOlsiZW1zaV9vcGVuIl19.vT30bhN0i_cq-0f8-gujNJzDuo2HN82pzdt_1NyiOkDOJfvlFAP0xAXsaC095_TGtUE9DMe1GLqTlyrOjVL-zuq_DlR3UZGkLyiPucCQpYVROzvVANl6DsjQXgT9GAgfUYoaf7yuqrFyPlSmDiWXdZen23ZtiA6Tyx8HI4fu5ezOqXJ_SgEtcWMcWlfFZoef5kO92SEkTefqSjmLMt1DHTbR_EseAdCt2mL7suMjtWwq8jzKiYevx6OUkm6Lw-hHGqI_LFa-kLHSBKmcX4X1RzMM2Y3fhSea6wJZrIeu1Hl_UiExerRBZgBZiLD2gcoUU4zSOPxqRHk9OF5Xi5L5jA"

  const authHeader = useMemo(() => {
    if (!token) return "";
    return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
  }, [token]);

  const debouncedQuery = useDebouncedValue(query.trim(), 350);

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
    if (debouncedQuery.length < minChars) {
      setSuggestions([]);
      setOpen(false);
      setIsLoading(false);
      setError(null);
      return;
    }
    fetchTitles(debouncedQuery);
  }, [debouncedQuery, minChars, fetchTitles]);

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
    setSelected(null);
    onChange?.(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onChange]);

  const setExperience = useCallback(
    (experience: SelectedTitle["experience"]) => {
      if (selected) {
        const updated = { ...selected, experience };
        setSelected(updated);
        onChange?.(updated);
      }
    },
    [selected, onChange],
  );

  const editTitle = useCallback(() => {
    setSelected(null);
    onChange?.(null);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onChange]);

  return (
    <div className={`w-full max-w-2xl mt-5`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>

      {!selected ? (
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
          {/* Title Card */}
          <div className="flex-1 max-w-4xl rounded-xl bg-gradient-to-br from-white to-[#e44126]/5 border-2 border-[#e44126]/20 shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#e44126] mb-1 truncate" title={selected.name}>
                  {selected.name}
                </h3>
                <p className="text-sm text-[#e44126]/70 font-medium">Selected Job Title</p>
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  className="rounded-lg border-2 border-[#e44126]/30 px-4 py-2 text-sm font-medium text-[#e44126] hover:bg-[#e44126]/10 hover:border-[#e44126]/50 transition-all duration-200 shadow-sm"
                  onClick={removeTitle}
                  aria-label={`Remove ${selected.name}`}
                  title="Remove title"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="max-w-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Years of experience in this title
              </label>
              <Select
                value={selected.experience}
                onValueChange={(val) => setExperience(val as SelectedTitle["experience"])}
              >
                <SelectTrigger className="w-full h-14 rounded-xl border-2 border-orange-200/80 bg-white px-5 text-base text-gray-800 font-medium focus:ring-3 focus:ring-[#e44126]/30 focus:border-[#e44126]/60 shadow-sm hover:border-orange-300/80 transition-all duration-200">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent className="border-orange-200/80 shadow-xl">
                  <SelectItem value="0-2" className="hover:bg-orange-50/80 focus:bg-orange-50/80 py-3">0-2 years</SelectItem>
                  <SelectItem value="3-5" className="hover:bg-orange-50/80 focus:bg-orange-50/80 py-3">3-5 years</SelectItem>
                  <SelectItem value="6-10" className="hover:bg-orange-50/80 focus:bg-orange-50/80 py-3">6-10 years</SelectItem>
                  <SelectItem value="10+" className="hover:bg-orange-50/80 focus:bg-orange-50/80 py-3">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}