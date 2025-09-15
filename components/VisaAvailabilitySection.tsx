// components/VisaAvailabilitySection.tsx
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ChevronLeft, ChevronRight, Clock, MapPin, Target } from "lucide-react";
import clsx from "clsx";

export type VisaData = {
  hasVisa?: "yes" | "no";
  nationality?: string;
  visaCountry?: string;
  visaType?: string;
  location?: string;
  preferredCountries?: string; // keep as plain string to match current behavior
  availability?:
    | "immediately"
    | "2-weeks"
    | "1-month"
    | "2-months"
    | "not-looking";
};

type Props = {
  /** Controlled value */
  value: VisaData | undefined;
  /** Update callback (use setState from parent) */
  onChange: (next: VisaData) => void;
  /** Back button handler */
  onBack: () => void;
  /** Continue button handler (receives latest data) */
  onContinue: (data: VisaData | undefined) => void;
  /** Optional extra class names on the outer Card */
  className?: string;
};

export default function VisaAvailabilitySection({
  value,
  onChange,
  onBack,
  onContinue,
  className,
}: Props) {
  const setVisaData = React.useCallback(
    (updater: (prev: VisaData) => VisaData) => {
      onChange(updater(value ?? {}));
    },
    [onChange, value]
  );

  return (
    <Card className={clsx("mb-12 hover-lift animate-slide-up shadow-lg border-0", className)}>
      <CardHeader className="text-center pb-8 pt-12">
        <CardTitle className="text-3xl text-balance mb-4 text-gray-900">
          Visa Status & Availability
        </CardTitle>
        <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your work rights, location, and availability help us match you to the most suitable opportunities.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-12">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Right to Work / Visa */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="has-visa" className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Do you currently hold a valid visa?
              </Label>
              <Select
                value={value?.hasVisa ?? undefined}
                onValueChange={(v) => setVisaData((p) => ({ ...p, hasVisa: v as VisaData["hasVisa"] }))}
              >
                <SelectTrigger id="has-visa" className="mt-1">
                  <SelectValue placeholder="Select one" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select “Yes” if you already hold a current visa for any country.
              </p>
            </div>

            <div>
              <Label htmlFor="nationality" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Citizenship / Nationality
              </Label>
              <Input
                id="nationality"
                placeholder="e.g., Indian"
                className="mt-1"
                value={value?.nationality ?? ""}
                onChange={(e) => setVisaData((p) => ({ ...p, nationality: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">As shown on your passport.</p>
            </div>
          </div>

          {/* Conditional visa details */}
          {value?.hasVisa === "yes" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="visa-country" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Visa issuing country
                </Label>
                <Input
                  id="visa-country"
                  placeholder="e.g., Australia"
                  className="mt-1"
                  value={value?.visaCountry ?? ""}
                  onChange={(e) => setVisaData((p) => ({ ...p, visaCountry: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Country that issued your current visa.
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Provide the official visa name or subclass where applicable.
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="current-location" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Current location
              </Label>
              <Input
                id="current-location"
                placeholder="City, State, Country (e.g., Sydney, NSW, Australia)"
                className="mt-1"
                value={value?.location ?? ""}
                onChange={(e) => setVisaData((p) => ({ ...p, location: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your present city and country of residence.
              </p>
            </div>

            <div>
              <Label htmlFor="preferred-country" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Preferred countries to work in
              </Label>
              <Input
                id="preferred-country"
                placeholder="e.g., Australia; Canada; USA"
                className="mt-1"
                value={value?.preferredCountries ?? ""}
                onChange={(e) => setVisaData((p) => ({ ...p, preferredCountries: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple countries with commas or semicolons.
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="availability" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Earliest start / notice period
              </Label>
              <Select
                value={value?.availability ?? undefined}
                onValueChange={(v) =>
                  setVisaData((p) => ({ ...p, availability: v as VisaData["availability"] }))
                }
              >
                <SelectTrigger id="availability" className="mt-1">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediate</SelectItem>
                  <SelectItem value="2-weeks">0-3 months</SelectItem>
                  <SelectItem value="1-month">3-6 months</SelectItem>
                  <SelectItem value="2-months">6+ months</SelectItem>
                  <SelectItem value="not-looking">Not looking for relocation</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Tell us when you could commence a new role.
              </p>
            </div>
          </div>

          {/* Why this matters */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Why this matters</h4>
            <p className="text-sm text-blue-800">
              Employers prioritise candidates with clear work rights, location fit, and start date. Accurate details improve matching and shorten time-to-hire.
            </p>
          </div>

          <div className="flex items-center justify-between">
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
