// components/VisaAvailabilitySection.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Radix primitives for radio
import * as RadioGroup from "@radix-ui/react-radio-group";

import { ChevronLeft, ChevronRight, Clock, MapPin, Target, X, Search } from "lucide-react";
import clsx from "clsx";

export type VisaData = {
  hasVisa?: "yes" | "no";
  nationality?: string;
  visaCountry?: string;
  visaType?: string;
  location?: string;             // free text (city, state, country)
  preferredCountries?: string[]; // MULTI-SELECT of countries
  availability?: "immediately" | "2-weeks" | "1-month" | "2-months" | "not-looking";
};

type Props = {
  value: VisaData | undefined;
  onChange: (next: VisaData) => void;
  onBack: () => void;
  onContinue: (data: VisaData | undefined) => void;
  className?: string;
};

// 30-country list (shared for nationality & preferred countries)
const COUNTRIES_30 = [
  "Australia", "Canada", "United States", "United Kingdom", "Germany", "France",
  "Italy", "Spain", "Netherlands", "Belgium", "Switzerland", "Sweden", "Norway",
  "Denmark", "Finland", "Ireland", "Austria", "Portugal", "Poland", "Czech Republic",
  "Hungary", "Greece", "New Zealand", "Singapore", "United Arab Emirates", "Qatar",
  "Saudi Arabia", "Japan", "South Korea", "India",
];

export default function VisaAvailabilitySection({
  value,
  onChange,
  onBack,
  onContinue,
  className,
}: Props) {
  const setVisaData = React.useCallback(
    (updater: (prev: VisaData) => VisaData) => onChange(updater(value ?? {})),
    [onChange, value]
  );

  const preferred = value?.preferredCountries ?? [];

  return (
    <Card className={clsx("mb-12 hover-lift animate-slide-up shadow-lg border-0", className)}>
      <CardHeader className="text-center pb-8 pt-12">
        <CardTitle className="text-3xl text-balance mb-2 text-gray-900">
          Visa Status & Availability
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-12">
        <div className="space-y-10 max-w-2xl mx-auto">
          {/* SECTION: Work Rights / Visa */}
          <section aria-labelledby="work-rights">
            <h3 id="work-rights" className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">
              Work Rights / Visa
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Has Visa (Radio) */}
              <div>
                <Label className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Do you currently hold a valid visa?
                </Label>
                <RadioGroup.Root
                  className="mt-2 grid grid-cols-2 gap-3"
                  value={value?.hasVisa ?? ""}
                  onValueChange={(v) => setVisaData((p) => ({ ...p, hasVisa: v as VisaData["hasVisa"] }))}
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroup.Item
                      id="visa-yes"
                      value="yes"
                      className="h-4 w-4 rounded-full border border-gray-400 flex items-center justify-center"
                    >
                      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                    </RadioGroup.Item>
                    <Label htmlFor="visa-yes">Yes</Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-md border p-2">
                    <RadioGroup.Item
                      id="visa-no"
                      value="no"
                      className="h-4 w-4 rounded-full border border-gray-400 flex items-center justify-center"
                    >
                      <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-primary" />
                    </RadioGroup.Item>
                    <Label htmlFor="visa-no">No</Label>
                  </div>
                </RadioGroup.Root>
              </div>

              {/* Nationality (Dropdown) */}
              <div>
                <Label htmlFor="nationality" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Citizenship / Nationality
                </Label>
                <Select
                  value={value?.nationality || undefined}
                  onValueChange={(v) => setVisaData((p) => ({ ...p, nationality: v }))}
                >
                  <SelectTrigger id="nationality" className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES_30.map((c) => (
                      <SelectItem key={`nat-${c}`} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conditional Visa Details */}
            {value?.hasVisa === "yes" && (
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label htmlFor="visa-country" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Visa issuing country
                  </Label>
                  <Input
                    id="visa-country"
                    placeholder="e.g., Australia / USA / Canada"
                    className="mt-1"
                    value={value?.visaCountry ?? ""}
                    onChange={(e) => setVisaData((p) => ({ ...p, visaCountry: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="visa-type" className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Visa class / category
                  </Label>
                  <Input
                    id="visa-type"
                    placeholder="e.g., Subclass 482 (TSS), H-1B, Work Permit"
                    className="mt-1"
                    value={value?.visaType ?? ""}
                    onChange={(e) => setVisaData((p) => ({ ...p, visaType: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </section>

          {/* SECTION: Location */}
          <section aria-labelledby="location">
            <h3 id="location" className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">
              Location
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Location (Text) */}
              <div>
                <Label htmlFor="current-location" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Current location
                </Label>
                <Input
                  id="current-location"
                  placeholder="City, State, Country (e.g., Hyderabad, Telangana, India)"
                  className="mt-1"
                  value={value?.location ?? ""}
                  onChange={(e) => setVisaData((p) => ({ ...p, location: e.target.value }))}
                />
              </div>

              {/* Preferred Countries (Headless Multi-select Dropdown) */}
              <div>
                <Label className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Preferred countries
                </Label>
                <MultiSelectDropdown
                  options={COUNTRIES_30}
                  value={preferred}
                  placeholder="Select countries"
                  onChange={(next) => setVisaData((p) => ({ ...p, preferredCountries: next }))}
                />
                {/* Chips */}
                {preferred.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferred.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
                      >
                        {c}
                        <button
                          type="button"
                          aria-label={`Remove ${c}`}
                          className="opacity-70 hover:opacity-100"
                          onClick={() =>
                            setVisaData((p) => ({
                              ...p,
                              preferredCountries: (p.preferredCountries ?? []).filter((x) => x !== c),
                            }))
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: Availability */}
          <section aria-labelledby="availability">
            <h3 id="availability" className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">
              Availability
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="availability" className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Earliest start
                </Label>
                <Select
                  value={value?.availability || undefined}
                  onValueChange={(v) =>
                    setVisaData((p) => ({ ...p, availability: v as VisaData["availability"] }))
                  }
                >
                  <SelectTrigger id="availability" className="mt-1">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediate</SelectItem>
                    <SelectItem value="2-weeks">0–3 months</SelectItem>
                    <SelectItem value="1-month">3–6 months</SelectItem>
                    <SelectItem value="2-months">6+ months</SelectItem>
                    <SelectItem value="not-looking">Not willing to relocate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Why this matters */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Why this matters</h4>
              <p className="text-sm text-blue-800">
                Employers prioritise candidates with clear work rights, location fit, and start date.
                Accurate details improve matching and shorten time-to-hire.
              </p>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="bg-transparent" onClick={onBack}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button size="lg" onClick={() => onContinue(value)} className="hover-lift">
              Continue to Profile <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================
   Headless Multi-select Dropdown
   - No shadcn popover/command
   - Search + checkboxes + Done/Clear
===============================*/
function MultiSelectDropdown({
  options,
  value,
  placeholder = "Select…",
  onChange,
}: {
  options: string[];
  value: string[];
  placeholder?: string;
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  const clear = () => onChange([]);
  const allVisibleSelected = filtered.length > 0 && filtered.every((o) => value.includes(o));
  const toggleAllVisible = () => {
    if (allVisibleSelected) onChange(value.filter((v) => !filtered.includes(v)));
    else onChange(Array.from(new Set([...value, ...filtered])));
  };

  return (
    <div ref={wrapperRef} className="relative mt-1">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value.length > 0 ? `${value.length} selected` : placeholder}
        <svg
          className="ml-2 h-4 w-4 opacity-50"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
        </svg>
      </Button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-lg"
        >
          {/* Search */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries…"
                className="w-full rounded-md border border-input bg-background pl-8 pr-2 py-1.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* Options */}
          <ul className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>
            )}
            {filtered.map((opt) => {
              const checked = value.includes(opt);
              return (
                <li
                  key={opt}
                  className="px-3 py-2 text-sm hover:bg-muted/50 cursor-pointer flex items-center gap-2"
                  onClick={() => toggle(opt)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4"
                    aria-label={opt}
                  />
                  <span className="flex-1">{opt}</span>
                </li>
              );
            })}
          </ul>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2 border-t p-2 bg-muted/30">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={toggleAllVisible}>
                {allVisibleSelected ? "Unselect visible" : "Select visible"}
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear
              </Button>
            </div>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
