// components/YPathReview.tsx
import * as React from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Star,
  Target,
  Info,
} from "lucide-react";
import clsx from "clsx";

export type StepId = "review" | "y-path" | "success";

export type ProfileSummary = {
  avatarLabel?: string;
  title?: string;
  experience?: string;
  visaStatus?: string;
  availability?: string;
};

export type Competitiveness = {
  /** e.g., "35% vs Locals" */
  oddsMeter?: string;
  /** e.g., "42/100" or "42" */
  giScore?: string;
  /** e.g., "Needs Enhancement" */
  profileStrength?: string;
  /** e.g., "JSS Premium" */
  recommendedPath?: string;
};

export type YPathBuckets = {
  immediate: string[];
  medium: string[];
  long: string[];
};

export type ProductSuggestion = {
  id: string;
  name: string;
  bullets: string[];
  href?: string;          // CTA link (forced to store for “Other Suggested”)
  ctaText?: string;       // Button text
  variant?: "primary" | "outline";
  highlight?: boolean;    // Visual emphasis
};

type Props = {
  className?: string;

  profile: ProfileSummary;
  competitiveness: Competitiveness;
  yPath: YPathBuckets;

  // Any extra services to show under "Other Suggested Services"
  suggestedServices?: ProductSuggestion[];

  onBack: () => void;
  onNext: () => void;

  // Optional (kept for compatibility)
  onSelectService?: (productId: string) => void;

  showDetailedTimeline?: boolean;

  // JSS Premium CTA
  jssHref?: string;
  jssCtaText?: string;
};

const STORE_URL = "https://store.y-axis.com/";

// IDs/names we treat as “Essential Add-ons”
const ESSENTIAL_IDS = new Set([
  "linkedin-optimization",
  "resume-writing",
  "resume-marketing",
]);

const ESSENTIAL_NAMES = [
  /linkedin\s*optimization/i,
  /professional\s*resume\s*writing/i,
  /resume\s*marketing/i,
];

export default function YPathReview({
  className,
  profile,
  competitiveness,
  yPath,
  suggestedServices = [],
  onBack,
  onNext,
  onSelectService,
  showDetailedTimeline = true,
  jssHref = STORE_URL,
  jssCtaText = "Get Free Consulation",
}: Props) {
  const oddsPct = parsePercent(competitiveness.oddsMeter);
  const gi = parseInt0to100(competitiveness.giScore);

  const jssReasons = buildJssReasons({
    oddsPct,
    gi,
    profileStrength: competitiveness.profileStrength,
  });

  // ----- Essential Add-ons (fixed three) -----
  const essentialAddOns: ProductSuggestion[] = [
    {
      id: "linkedin-optimization",
      name: "LinkedIn Optimization",
      bullets: [
        "Headline & About that rank in searches",
        "Keyword tuning for recruiter filters",
        "Role-aligned achievements",
      ],
      href: STORE_URL,
      ctaText: "Go to Store",
      highlight: true,
    },
    {
      id: "resume-writing",
      name: "Professional Resume Writing",
      bullets: [
        "ATS-optimized formatting and keywords",
        "Impact-focused bullet rewrites",
        "Modern, recruiter-friendly templates",
      ],
      href: STORE_URL,
      ctaText: "Go to Store",
    },
    {
      id: "resume-marketing",
      name: "Resume Marketing",
      bullets: [
        "Targeted outreach to relevant job posts",
        "Tracker & weekly progress updates",
        "Application strategy & follow-ups",
      ],
      href: STORE_URL,
      ctaText: "Go to Store",
    },
  ];

  // ----- Other Suggested (from props), minus JSS & Essentials, all CTAs forced to Store -----
  const otherSuggested = (suggestedServices || [])
    .filter((svc) => !/jss\s*premium/i.test(svc.name)) // exclude JSS Premium duplicate
    .filter((svc) => !ESSENTIAL_IDS.has(svc.id) && !ESSENTIAL_NAMES.some((rx) => rx.test(svc.name)))
    .map((svc) => ({
      ...svc,
      href: STORE_URL,
      ctaText: svc.ctaText || "Go to Store",
    }));

  return (
    <Card className={clsx("shadow-lg border-0 hover-lift", className)} role="region" aria-label="Review and Y-Path">
      <CardHeader className="text-center pb-6 pt-10">
        <CardTitle className="text-3xl text-balance mb-3 text-gray-900">
          Review Your Y-Path
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Your profile overview, scores, and the recommended next steps — all in one flow.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-10">
        {/* =====================================================
            1) PROFILE & SCORES
        ====================================================== */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">1. Your Profile & Scores</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Star className="w-5 h-5 mr-2" /> Primary Expertise
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <Row label="Avatar:" value={profile.avatarLabel ?? "—"} />
                <Row label="Title:" value={profile.title ?? "—"} />
                <Row label="Experience:" value={profile.experience ?? "—"} />
                <Row label="Visa Status:" value={profile.visaStatus ?? "—"} />
                <Row label="Availability:" value={profile.availability ?? "—"} />
              </div>
            </div>

            {/* Scores & Competitiveness */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <Target className="w-5 h-5 mr-2" /> Competitiveness Assessment
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <ScoreDonut
                  label="Odds vs Locals"
                  value={oddsPct ?? 0}
                  max={100}
                  suffix="%"
                  color="rgb(228,65,38)"
                  ariaLabel={`Odds vs locals ${oddsPct ?? 0} percent`}
                />
                <ScoreDonut
                  label="Global Indian Score"
                  value={gi ?? 0}
                  max={100}
                  suffix="/100"
                  color="rgb(28,100,242)"
                  ariaLabel={`Global Indian Score ${gi ?? 0} out of 100`}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <Row label="Odds Meter:" value={competitiveness.oddsMeter ?? "—"} valueClass="text-destructive" />
                <Row label="GI Score:" value={competitiveness.giScore ?? "—"} valueClass="text-destructive" />
                <Row label="Profile Strength:" value={competitiveness.profileStrength ?? "—"} />
                <Row label="Recommended Path:" value={competitiveness.recommendedPath ?? "—"} valueClass="text-primary" />
              </div>
            </div>
          </div>
        </section>

        <Hr />
        {/* =====================================================
            5) DETAILED ROADMAP (Optional)
        ====================================================== */}
        {showDetailedTimeline && (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">
                {otherSuggested.length > 0 ? "2. Choose your Y-Path" : "2. Choose your Y-Path"}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <YPathColumn
                  title="Immediate (0-3 months)"
                  items={yPath.immediate}
                  colorClass="text-primary"
                  bordered
                  strongBorder
                />
                <YPathColumn title="Medium-term (3-12 months)" items={yPath.medium} />
                <YPathColumn title="Long-term (1-3 years)" items={yPath.long} muted />
              </div>
            </section>
          </>
        )}

        {/* =====================================================
            2) RECOMMENDED: JSS PREMIUM
        ====================================================== */}
         <Hr />
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Recommended Next Step: JSS Premium (12 Weeks)</h2>

          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary">Why we recommend JSS Premium for you</h3>
            </div>

            <ul className="text-sm space-y-2">
              {jssReasons.map((r, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2">What you get:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Professional resume rewrite (ATS-optimized)</li>
                  <li>• LinkedIn profile optimization</li>
                  <li>• Job search strategy & coaching</li>
                  <li>• Interview preparation (mock + feedback)</li>
                  <li>• 90-day job placement support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Expected outcomes:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Stronger recruiter visibility & shortlists</li>
                  <li>• More interview calls with better conversion</li>
                  <li>• Faster time-to-offer with clearer positioning</li>
                  <li>• Typical profile uplift: +25 points*</li>
                </ul>
                <p className="text-[11px] text-muted-foreground mt-2">
                  *Based on similar candidate profiles after resume & LinkedIn optimization plus JSS coaching.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <a href={jssHref} target="_blank" rel="noopener noreferrer">
                  {jssCtaText} <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Hr />

        {/* =====================================================
            3) ESSENTIAL ADD-ONS (fixed)
        ====================================================== */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Other Recommended Services</h2>
          <p className="text-sm text-muted-foreground">
            Make your profile market-ready with LinkedIn Optimization, Resume Writing, and Resume Marketing.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {essentialAddOns.map((svc) => (
              <ServiceCard key={svc.id} svc={svc} forceStore />
            ))}
          </div>
        </section>

        {/* =====================================================
            4) OTHER SUGGESTED SERVICES (from props)
        ====================================================== */}
        {/* {otherSuggested.length > 0 && (
          <>
            <Hr />
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">4. Other Suggested Services</h2>
              <p className="text-sm text-muted-foreground">
                Complement your plan with add-ons curated for your profile.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {otherSuggested.map((svc) => (
                  <ServiceCard key={svc.id} svc={svc} forceStore />
                ))}
              </div>
            </section>
          </>
        )} */}

        

        {/* =====================================================
            Single CTA Row
        ====================================================== */}
        <div className="mt-10 flex items-center justify-between">
          <Button variant="outline" className="bg-transparent" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button size="lg" onClick={onNext}>
            Continue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- small components ---------- */

function ServiceCard({ svc, forceStore }: { svc: ProductSuggestion; forceStore?: boolean }) {
  const href = STORE_URL; // force to store as requested
  const cta = svc.ctaText || "Go to Store";
  return (
    <Card className={clsx("h-full", svc.highlight && "border-2 border-primary/30")} aria-label={`Service: ${svc.name}`}>
      <CardHeader>
        <CardTitle className={clsx("text-lg", svc.highlight && "text-primary")}>{svc.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ul className="text-sm space-y-1">
          {svc.bullets.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
        <div className="mt-4">
          <Button asChild className="w-full">
            <a href={href} target="_blank" rel="noopener noreferrer">
              {cta} <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={clsx("font-medium", valueClass)}>{value ?? "—"}</span>
    </div>
  );
}

function YPathColumn({
  title,
  items,
  colorClass,
  bordered,
  strongBorder,
  muted,
}: {
  title: string;
  items: string[];
  colorClass?: string;
  bordered?: boolean;
  strongBorder?: boolean;
  muted?: boolean;
}) {
  return (
    <Card className={clsx(bordered && "border-2", strongBorder && "border-primary/20")}>
      <CardHeader>
        <CardTitle className={clsx("text-lg", colorClass)}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items?.length ? (
          <ul className="space-y-2 text-sm">
            {items.map((text, i) => (
              <li key={i} className="flex items-start">
                <span
                  className={clsx(
                    "mr-2",
                    muted ? "text-gray-400" : colorClass ? "text-blue-500" : "text-blue-500"
                  )}
                >
                  {muted ? "○" : i < 4 ? (colorClass ? "✓" : "○") : "○"}
                </span>
                {text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No items.</p>
        )}
      </CardContent>
    </Card>
  );
}

function Hr() {
  return <div className="my-8 border-t border-gray-200" role="separator" aria-hidden="true" />;
}

/* ---------- infographics ---------- */
function ScoreDonut({
  value,
  max = 100,
  label,
  suffix = "",
  color = "rgb(228,65,38)",
  ariaLabel,
}: {
  value: number;
  max?: number;
  label: string;
  suffix?: string;
  color?: string;
  ariaLabel?: string;
}) {
  const pct = clamp((value / max) * 100, 0, 100);
  const r = 45;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <div className="rounded-lg border bg-white p-3 text-center">
      <div className="relative w-28 h-28 mx-auto mb-2">
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120" aria-label={ariaLabel}>
          <circle cx="60" cy="60" r={r} stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${dash} ${c}`}
            className="transition-all duration-700"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center leading-tight">
            <div className="text-2xl font-bold" style={{ color }}>
              {Math.round(value)}
            </div>
            <div className="text-[10px] text-gray-500">{suffix || ""}</div>
          </div>
        </div>
      </div>
      <div className="text-xs font-medium text-gray-700">{label}</div>
    </div>
  );
}

/* ---------- parsing & logic ---------- */
function parsePercent(text?: string): number | undefined {
  if (!text) return undefined;
  const m = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? clamp(n, 0, 100) : undefined;
}

function parseInt0to100(text?: string): number | undefined {
  if (!text) return undefined;
  const m = text.match(/(\d+(?:\.\d+)?)/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? clamp(n, 0, 100) : undefined;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildJssReasons({
  oddsPct,
  gi,
  profileStrength,
}: {
  oddsPct?: number;
  gi?: number;
  profileStrength?: string;
}): string[] {
  const reasons: string[] = [];

  if (typeof gi === "number") {
    if (gi < 60)
      reasons.push(
        `GI Score is ${gi}/100 — below the competitive threshold; structured profile uplift is recommended.`
      );
    else reasons.push(`GI Score is ${gi}/100 — targeted improvements can still boost recruiter conversions.`);
  } else {
    reasons.push("Your GI Score indicates room for improvement with profile positioning and market alignment.");
  }

  if (typeof oddsPct === "number") {
    if (oddsPct < 50)
      reasons.push(
        `Odds vs locals is ${oddsPct}% — resume + LinkedIn optimization typically increases shortlist rates.`
      );
    else reasons.push(`Odds vs locals is ${oddsPct}% — polishing narrative and achievements can push you higher.`);
  } else {
    reasons.push("Improving resume/LinkedIn clarity and keyword coverage typically increases interview call rates.");
  }

  if (/need/i.test(profileStrength || "")) {
    reasons.push(
      "Profile Strength shows “Needs Enhancement” — JSS addresses content gaps, structure, and market signaling."
    );
  } else if (profileStrength) {
    reasons.push(`Profile Strength: ${profileStrength} — JSS fine-tunes for stronger recruiter relevance.`);
  }

  reasons.push("JSS combines expert editing + coaching, so changes translate into measurable outcomes during applications.");
  return reasons;
}
