"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type TitleItem = { id: string; name: string };
type SelectedTitle = { id: string; name: string; experience?: "0-2" | "3-5" | "6-10" | "10+" };

const LIGHTCAST_TOKEN = "Bearer <YOUR_TOKEN_HERE>"; // ← put your token here (client-side is ok for quick tests; prefer server-side in production)

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
  onChange?: (titles: SelectedTitle[]) => void;
}

const API_BASE = "https://emsiservices.com/titles/versions/latest/titles";

export default function TitleSelector({                // ← uses the token variable by default
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
  const [selected, setSelected] = useState<SelectedTitle[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string | null>(null);

  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3NTc2ODMzMjYsImV4cCI6MTc1NzY4NjkyNiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6ImNlZXRveGR5YWxmOGZxNzUiLCJuYW1lIjoiUmFtZXNoIERlc2giLCJjb21wYW55IjoiRGVzaCIsImVtYWlsIjoicmFtZXNod2FyYW0xMkB5b3BtYWlsLmNvbSIsImlhdCI6MTc1NzY4MzMyNiwic2NvcGUiOlsiZW1zaV9vcGVuIl19.wx9bAZV747s8oAXHyI9DB7H8eN4EveH_MdlbHRWipzknI-konMZnedQ_H6VcYr3xCNf247yvvBRFnWGgm-n_7qx1BV1Yybc3_h8_HJrhljo1fZk_En1elUmGvx1HbJoBgTpl9iFuuXBWy7fJROUlIX59ImozhJ6gb7lSmaPvx70Rj2GIQsm3GHn10cOT0Ql-i6bHzwzt9lJ2kLZzKQh6a-X0S3iR211XFUVicwAZb_L0fYNxGvEiV_79uwD_Bhp0UcDrb5S5pp5sashBrwa61YSgO0_2dBDh4awLAPX60ibYSXzT43lGWxsQiiUOUUSZFpkM5QqL9st2WhCrWaaLIw"

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

  const addTitle = useCallback(
    (item: TitleItem) => {
      setSelected((prev) => {
        if (prev.some((t) => t.id === item.id)) return prev;
        const next = [...prev, { ...item }];
        onChange?.(next);
        return next;
      });
      setQuery("");
      setSuggestions([]);
      setOpen(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange],
  );

  const removeTitle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = prev.filter((t) => t.id !== id);
        onChange?.(next);
        return next;
      });
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange],
  );

  const setExperience = useCallback(
    (id: string, experience: SelectedTitle["experience"]) => {
      setSelected((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, experience } : t));
        onChange?.(next);
        return next;
      });
    },
    [onChange],
  );

  return (
    <div className={`w-[720px] max-w-full ${className}`}> {/* ← wider wrapper */}
      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>

      <div className="relative w-full"> {/* input + dropdown will both span 720px */}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="cursor-pointer px-4 py-2 hover:bg-indigo-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addTitle(item)}
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

      {selected.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {selected.map((t) => (
            <div key={t.id} className="w-full max-w-xl rounded-xl bg-white border border-indigo-200 shadow-sm p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-indigo-900">{t.name}</span>
                <button
                  type="button"
                  className="rounded-full border border-indigo-300 px-2 text-xs text-indigo-700 hover:bg-indigo-50"
                  onClick={() => removeTitle(t.id)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label={`Remove ${t.name}`}
                  title="Remove"
                >
                  ×
                </button>
              </div>

              <div className="mt-3">
                <label className="block text-[13px] text-indigo-700 mb-1">
                  Years of experience in this title
                </label>
                <Select
                  value={t.experience}
                  onValueChange={(val) => setExperience(t.id, val as SelectedTitle["experience"])}
                >
                  <SelectTrigger className="w-full h-9 rounded-md border border-indigo-200 bg-white px-3 text-sm text-indigo-900">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
