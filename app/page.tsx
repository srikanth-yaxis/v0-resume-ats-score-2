"use client"

import type React from "react"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import SkillSelector from "@/components/skill-selector"
import TitleSelector from "@/components/title-selector"
import ProfileSection1 from "@/components/profile-section-1"
import ProfileSection2 from "@/components/profile-section-2"
import YPathReview, {
  ProfileSummary,
  Competitiveness,
  YPathBuckets,
  ProductSuggestion,
} from "@/components/YPathReview";
import {
  Upload,
  ExternalLink,
  User,
  CheckCircle,
  Target,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  Search,
  TrendingUp,
} from "lucide-react"
import VisaAvailabilitySection from "@/components/VisaAvailabilitySection"

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const FilePreview = ({ file }: { file: any }) => {
  const docs = [
    { uri: file ? URL.createObjectURL(file) : "https://arxiv.org/pdf/quant-ph/0410100.pdf", fileName: file ? file.name : "Sample Resume" },
  ]
  return (
    <DocViewer
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      config={{
        header: { disableHeader: true, disableFileName: true },
        pdfZoom: { defaultZoom: 1.25, zoomJump: 0.25 },
        pdfVerticalScrollByDefault: true,
      }}
      className="max-h-[90vh] overflow-auto sticky top-16"
    />

  )
}

/* ---------------------
   Config
--------------------- */
const PARSE_ENDPOINT = "http://13.126.164.132:8000/parse-resume"
const RESUME_MODEL = "nova"


const steps = [
  { id: "upload", label: "Resume" },
  { id: "expertise", label: "Expertise" },
  { id: "visa-availability", label: "Visa & Location" },
  { id: "profile", label: "Profile" },
  // { id: "profile-2", label: "Profile" },
  { id: "odds-meter", label: "Assessment" },
  { id: "y-path", label: "Y-Path" },
  { id: "success", label: "Success" },
] as const

type StepId = typeof steps[number]["id"]

const resumeTips = [
  "Analyzing keywords in your resume…",
  "Scanning work experience for impact verbs…",
  "Checking formatting and structure…",
  "Assessing ATS compatibility…",
  "Extracting skills and certifications…",
  "Matching your profile to roles…",
  "Highlighting measurable achievements…",
  "Detecting duplicate or weak bullets…",
  "Normalizing job titles and dates…",
  "Cross-referencing skills with market demand…",
  "Optimizing section order for readability…",
  "Identifying gaps and recommending upskilling…",
  "Comparing against top-performing resumes…",
  "Suggesting stronger action verbs…",
  "Reviewing summary for clarity and focus…",
]

/* ---------------------
   Fancy Upload Carousel
--------------------- */
function UploadProgressCarousel({
  progress,
  phaseLabel,
}: {
  progress: number
  phaseLabel: string
}) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % resumeTips.length), 1500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const revealedCount = Math.min(resumeTips.length, Math.max(1, Math.ceil((progress / 100) * resumeTips.length)))
  return (
    <div className="flex flex-col items-center">
      {/* spotlight container */}
      <div className="relative w-full max-w-xl rounded-xl p-4 bg-white shadow-md border">
        <div className="pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur" />
        <div className="relative">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{phaseLabel}</h4>
          <ul className="space-y-1.5 max-h-40 overflow-hidden" aria-live="polite">
            {resumeTips.slice(0, revealedCount).map((tip, i) => {
              const isCurrent = i === Math.min(index, revealedCount - 1)
              const isDone = i < revealedCount - 1
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-2 rounded-md px-2 py-1",
                    isCurrent && "bg-primary/5 border border-primary/20",
                    isDone && !isCurrent && "opacity-80",
                  )}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                  </div>
                  <p className={cn("text-xs", isCurrent ? "text-gray-900" : "text-gray-700")}>{tip}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* progress */}
      <div className="mt-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-1 text-xs text-gray-700">
          <span>Uploading & parsing…</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/* ---------------------
   Mini marquee carousel
--------------------- */
function MiniInfoCarousel({
  items,
  icon = "file",
  speed = 25,
}: {
  items: string[]
  icon?: "file" | "spark" | "search"
  speed?: number
}) {
  const Icon = icon === "spark" ? Sparkles : icon === "search" ? Search : FileText
  const track = [...items, ...items]
  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-transparent to-white [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />
      <div
        className="flex items-center gap-4 whitespace-nowrap will-change-transform animate-[marquee_linear_infinite]"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((text, i) => (
          <div
            key={i}
            className="shrink-0 flex items-center gap-2 py-2 px-3 rounded-md bg-muted transition-colors"
          >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-xs text-gray-800">{text}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-\[marquee_linear_infinite\] {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  )
}

/* ---------------------
   Stepper (mobile)
--------------------- */
function Stepper({
  current,
  completed,
  onJump,
}: {
  current: StepId
  completed: Set<StepId>
  onJump?: (id: StepId) => void
}) {
  const currentIdx = steps.findIndex((s) => s.id === current)
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 text-xs">
        {steps.slice(0, 5).map((s, idx) => {
          const isDone = completed.has(s.id) || idx < currentIdx
          const isCurrent = s.id === current
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onJump?.(s.id)}
              className={cn(
                "flex items-center space-x-2",
                isCurrent ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  isCurrent
                    ? "border-primary bg-primary text-white"
                    : isDone
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
              </div>
              <span className="font-semibold">{s.label}</span>
            </button>
          )
        })}
      </div>
      <Progress
        value={((steps.findIndex((s) => s.id === current) + 1) / steps.length) * 100}
        className="h-2.5 bg-gray-100"
      />
    </div>
  )
}

/* ---------------------
   Stepper (sidebar)
--------------------- */
function StepperSidebar({
  current,
  completed,
  onJump,
}: {
  current: StepId
  completed: Set<StepId>
  onJump?: (id: StepId) => void
}) {
  const currentIdx = useMemo(() => steps.findIndex((s) => s.id === current), [current])
  const progressPct = ((currentIdx + 1) / steps.length) * 100

  const refs = useRef<Record<StepId, HTMLButtonElement | null>>({} as any)
  useEffect(() => {
    const el = refs.current[current]
    if (el) el.scrollIntoView({ block: "nearest" })
  }, [current])

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 self-start lg:mr-4 ">
      <div className="rounded-2xl border bg-white shadow-sm p-2">
        {/* header + tiny progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-900">Journey</span>
            <span className="text-muted-foreground">
              {currentIdx + 1}/{steps.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* timeline list */}
        <ol className="relative pt-2 flex-1 overflow-y-auto pr-1">
          <div className="pointer-events-none absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-gray-200 to-transparent" />
          {steps.map((s, idx) => {
            const isCurrent = s.id === current
            const isPast = idx < currentIdx
            const isDone = completed.has(s.id) || isPast
            return (
              <li key={s.id} className="relative my-2">
                <button
                  // ref={(el) => (refs.current[s.id] = el)}
                  type="button"
                  onClick={() => onJump?.(s.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "group w-full pl-10 pr-3 py-2.5 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
                    isCurrent ? "bg-primary/10 text-primary" : "hover:bg-gray-50",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-semibold",
                      isDone
                        ? "border-primary bg-primary text-white"
                        : isCurrent
                          ? "border-primary text-primary bg-white"
                          : "border-gray-300 text-gray-500 bg-white"                          
                    )}
                  >
                    {isDone ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-medium", isCurrent ? "text-primary" : "text-gray-900")}>
                      {s.label}
                    </span>
                    {/* <span className="text-[10px] uppercase tracking-wide text-gray-400">{status}</span> */}
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

/* ---------------------
   Main
--------------------- */
export default function YTPHomePage() {
  const [currentStep, setCurrentStep] = useState<StepId>("upload")
  const [completed, setCompleted] = useState<Set<StepId>>(new Set())
  const [skills, setSkills] = useState([])

  const [expertiseData, setExpertiseData] = useState<any>({
    avatar1: { role: "", experience: "", skills: [] },
    avatar2: { role: "", experience: "", skills: [] },
    avatar3: { role: "", experience: "", skills: [] },
  })
  const [visaData, setVisaData] = useState<any>({ status: "", location: "", availability: "", relocate: "" })
  const [profileData, setProfileData] = useState<any>(null)

  /* Upload & parsing states */
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  type Phase = "idle" | "uploading" | "parsing" | "done" | "error"
  const [phase, setPhase] = useState<Phase>("idle")

  const [uploadPct, setUploadPct] = useState(0)   // real upload
  const [parsePct, setParsePct] = useState(0)     // synthetic while waiting
  const parsingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [displayPct, setDisplayPct] = useState(0) // weighted % we show
  const [parsedResume, setParsedResume] = useState<any>(null)

  const currentIdx = steps.findIndex((s) => s.id === currentStep)
  const canGoBack = currentIdx > 0 && currentStep !== "success"

  const markCompleteAndNext = (id: StepId) => {
    setCompleted((prev) => new Set(prev).add(id))
    const idx = steps.findIndex((s) => s.id === id)
    const next = steps[Math.min(idx + 1, steps.length - 1)].id
    setCurrentStep(next)
  }

  const goBack = () => setCurrentStep(steps[Math.max(currentIdx - 1, 0)].id)
  const goNext = () => setCurrentStep(steps[Math.min(currentIdx + 1, steps.length - 1)].id)

  /* File validations */
  const ALLOWED_MIME = useMemo(
    () =>
      new Set([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]),
    [],
  )
  const ALLOWED_EXT = useMemo(() => new Set([".pdf", ".doc", ".docx"]), [])

  const isAllowedResume = (file: File) => {
    if (ALLOWED_MIME.has(file.type)) return true
    const name = file.name.toLowerCase()
    return Array.from(ALLOWED_EXT).some((ext) => name.endsWith(ext))
  }

  /* Weighted progress (70% upload + 30% parsing) */
  useEffect(() => {
    const weighted = Math.min(100, Math.floor(uploadPct * 0.7 + parsePct * 0.3))
    setDisplayPct((prev) => (weighted < prev ? prev : weighted))
  }, [uploadPct, parsePct])

  const stopParsingTick = () => {
    if (parsingIntervalRef.current) {
      clearInterval(parsingIntervalRef.current)
      parsingIntervalRef.current = null
    }
  }

  const startParsingTick = () => {
    stopParsingTick()
    setPhase("parsing")
    setParsePct((p) => (p < 1 ? 1 : p))
    parsingIntervalRef.current = setInterval(() => {
      setParsePct((p) => (p >= 99 ? 99 : p + 1))
    }, 180)
  }

  /* Upload Handlers */
  const uploadResume = (file: File) => {
    setPhase("uploading")
    setUploadError(null)
    setParsedResume(null)
    setUploadPct(0)
    setParsePct(0)
    setDisplayPct(0)

    const form = new FormData()
    form.append("file", file)
    form.append("models", RESUME_MODEL)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", PARSE_ENDPOINT, true)


    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const json = JSON.parse(xhr.responseText);
        console.log(typeof (json), typeof (skills));
        setSkills(json.results.nova.Skills)
        console.log("✅ Response:", json.results.nova.Skills);
      } else {
        console.error("❌ Request failed:", xhr.status, xhr.statusText);
      }
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.max(0, Math.min(100, Math.round((e.loaded / e.total) * 100)))
        setUploadPct(pct)
        if (pct >= 100 && phase !== "parsing") {
          startParsingTick()
        }
      } else {
        setUploadPct((p) => (p < 60 ? p + 1 : p))
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return
      stopParsingTick()

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText || "{}")
          setParsedResume(data)
          setPhase("done")
          setUploadPct((p) => (p < 100 ? 100 : p))
          setParsePct(100)
          setDisplayPct(100)
          markCompleteAndNext("upload")
        } catch {
          setPhase("error")
          setUploadError("Upload succeeded but response could not be parsed.")
        }
      } else {
        setPhase("error")
        setUploadError(`Upload failed (${xhr.status} ${xhr.statusText || ""}).`)
      }
    }

    xhr.onerror = () => {
      stopParsingTick()
      setPhase("error")
      setUploadError("Network error while uploading. Please try again.")
    }

    xhr.send(form)

    setTimeout(() => {
      if (phase === "uploading" && uploadPct < 100) {
      } else if (phase !== "parsing" && phase !== "done" && phase !== "error") {
        startParsingTick()
      }
    }, 1000)
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    if (!isAllowedResume(file)) {
      setUploadError("Only PDF or DOC/DOCX are allowed.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Max 10MB.")
      return
    }
    uploadResume(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) handleFileUpload(files[0])
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleFileUpload(files[0])
  }

  /* Stage Complete Callbacks */
  const handleExpertiseComplete = (data: any) => {
    setExpertiseData(data)
    markCompleteAndNext("expertise")
  }
  const handleVisaComplete = (data: any) => {
    setVisaData(data)
    markCompleteAndNext("visa-availability")
  }
  const handleProfileSection1Complete = (data: any) => {
    setProfileData((prev: any) => ({ ...prev, section1: data }))
    markCompleteAndNext("profile")
  }
  // const handleProfileSection2Complete = (data: any) => {
  //   setProfileData((prev: any) => ({ ...prev, section2: data }))
  //   markCompleteAndNext("profile-2")
  // }
  const handleOddsMeterContinue = () => markCompleteAndNext("odds-meter")
  const handleYPathContinue = () => markCompleteAndNext("y-path")



  function ConceptsExplainer() {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Key Concepts</CardTitle>
          <CardDescription>
            Quick primer on YTP, GIS, and ATS so candidates know what they’re seeing and why it matters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* YTP */}
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">YTP</span>
                <Badge variant="secondary">Y-Axis Talent Pool</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">What is YTP:</span>{" "}
                YTP (Y-Axis Talent Pool) is a platform that builds globally standardized, verified candidate profiles for jobs, study, and migration.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Why it’s needed:</span>{" "}
                It helps candidates showcase skills, visa readiness, and availability clearly, making them discoverable and competitive worldwide.
              </p>
            </div>

            {/* GIS */}
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">GIS</span>
                <Badge variant="secondary">Global Indian Score</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">What is GIS:</span>{" "}
                GIS (Global Indian Score) is a 0–100 score that measures a candidate’s likelihood of succeeding abroad based on skills, education, visa, and readiness.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Why it’s necessary:</span>{" "}
                It gives candidates a clear benchmark of their global readiness and highlights actions to improve chances of success.
              </p>
            </div>

            {/* ATS */}
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">ATS</span>
                <Badge variant="secondary">Applicant Tracking System</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-medium text-foreground">What is ATS:</span>{" "}
                ATS (Applicant Tracking System) is software recruiters use to scan, filter, and rank resumes before human review.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Why it’s necessary:</span>{" "}
                It saves recruiters time, ensures fair shortlisting, and helps candidates with optimized profiles get noticed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Example data mapping from your state
  const profile: ProfileSummary = {
    avatarLabel: "Avatar 1",
    title: "Senior Software Developer",
    experience: "6-10 years",
    visaStatus: "Work Visa",
    availability: "2 weeks notice",
  };

  const competitiveness: Competitiveness = {
    oddsMeter: "35% vs Locals",
    giScore: "42/100",
    profileStrength: "Needs Enhancement",
    recommendedPath: "JSS Premium",
  };

  const yPath: YPathBuckets = {
    immediate: [
      "Professional resume rewrite (+25 points)",
      "LinkedIn optimization",
      "Job search strategy (JSS)",
      "Interview preparation",
    ],
    medium: [
      "Skills certification programs",
      "Professional networking",
      "Visa pathway consultation",
      "Industry mentorship",
    ],
    long: [
      "PR/citizenship pathway",
      "Leadership development",
      "Advanced certifications",
      "Career advancement",
    ],
  };

  const suggestedServices: ProductSuggestion[] = [
    {
      id: "jss-premium",
      name: "JSS Premium",
      bullets: [
        "Resume rewrite, LinkedIn optimization",
        "Job search strategy & coaching",
        "Interview preparation",
        "90-day job placement support",
      ],
      href: "https://store.y-axis.com/",
      ctaText: "Start JSS Premium",
      highlight: true,
    },
    {
      id: "skills-cert",
      name: "Skills Certification",
      bullets: ["Pick role-aligned certs", "Exam prep roadmap", "Career signaling"],
      href: "https://store.y-axis.com/",
      ctaText: "Explore",
      variant: "outline",
    },
    {
      id: "visa-consult",
      name: "Visa Consultation",
      bullets: ["Best-fit pathway", "Country-wise options", "Timeline & eligibility"],
      href: "https://store.y-axis.com/",
      ctaText: "Book consult",
      variant: "outline",
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/y-axis-logo.png" alt="Y-axis Logo" width={100} height={25} />
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-xl font-bold text-gray-900">Talent Pool</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:[grid-template-columns:20%_80%] ">
          <StepperSidebar current={currentStep} completed={completed} onJump={(id) => setCurrentStep(id)} />
          <section>
            <div className="lg:hidden">
              <Stepper current={currentStep} completed={completed} onJump={(id) => setCurrentStep(id)} />
            </div>

            {/* ---------------- Upload ---------------- */}
            {currentStep === "upload" && (
              <Card className="mb-10 hover-lift animate-slide-up shadow-lg border-0">
                <CardHeader className="text-center ">
                  <CardTitle className="text-balance mb-2 text-gray-900">Upload Your Resume</CardTitle>
                  <CardDescription className="text-sm text-gray-600 max-w-2xl mx-auto">
                    Start by uploading your resume. We'll use it to tailor the next steps of your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Upload your resume by dropping a file here or clicking to browse"
                    className={cn(
                      "mx-auto w-full max-w-2xl border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer",
                      isDragOver ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50/50",
                      "hover:border-primary hover:bg-primary/5",
                    )}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onClick={() => document.getElementById("resume-upload")?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        document.getElementById("resume-upload")?.click()
                      }
                    }}
                  >
                    {phase === "idle" || phase === "error" ? (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-1 text-gray-900">Drop your resume here</h3>
                        <p className="text-gray-600 mb-4 text-sm">or click to browse files</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="resume-upload"
                        />
                        <Button size="sm" className="hover-lift" asChild>
                          <label htmlFor="resume-upload" className="cursor-pointer">Choose File</label>
                        </Button>
                        <p className="text-xs text-gray-500 mt-3">PDF & DOC/DOCX only, max 10MB</p>
                        {uploadedFile && phase === "idle" && (
                          <p className="mt-3 text-xs text-gray-700">
                            Selected: <span className="font-medium">{uploadedFile.name}</span>
                          </p>
                        )}
                        {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
                      </>
                    ) : (
                      <UploadProgressCarousel
                        progress={displayPct}
                        phaseLabel={
                          phase === "uploading"
                            ? "Uploading your resume…"
                            : phase === "parsing"
                              ? "Parsing your resume…"
                              : "Finalizing…"
                        }
                      />
                    )}
                  </div>

                  {/* reasons / carousels */}
                  <div className="mt-8 space-y-3">
                    <MiniInfoCarousel
                      icon="spark"
                      speed={30}
                      items={[
                        "Instant skill extraction",
                        "ATS-readiness check",
                        "Bullet impact analysis",
                        "Action verbs suggestions",
                        "Gap detection & fixes",
                        "Role alignment insights",
                        "Formatting feedback",
                      ]}
                    />
                    <MiniInfoCarousel
                      icon="search"
                      speed={28}
                      items={[
                        "Match to real job posts",
                        "Market demand mapping",
                        "Keyword coverage score",
                        "Title normalization",
                        "Experience calibration",
                        "Certs & licenses highlight",
                        "Domain-specific tips",
                      ]}
                    />
                  </div>

                  {/* ⬇️ Add here */}
                  <div className="mt-8">
                    <ConceptsExplainer />
                  </div>
                </CardContent>
              </Card>
            )}




            {/* ---------------- Expertise ---------------- */}
            {currentStep === "expertise" && (
              <Card className="mb-12 hover-lift animate-slide-up shadow-lg border-0">
                <div className="space-y-6">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-balance">Your ATS Score</CardTitle>
                      <CardDescription>
                        Based on analysis of your resume: {uploadedFile?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${42 * 3.14159} ${314.159}`}
                            className="text-destructive"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-destructive">42</div>
                            <div className="text-sm text-muted-foreground">out of 100</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 w-full max-w-3xl mx-auto">
                        <h3 className="font-semibold text-destructive mb-2">Score Analysis</h3>
                        <ul className="text-sm text-left space-y-1">
                          <li>• Missing key industry keywords</li>
                          <li>• Formatting issues detected</li>
                          <li>• Skills section needs improvement</li>
                          <li>• Work experience lacks quantifiable achievements</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <CardHeader className="text-center pb-8 pt-5">
                  <CardTitle className="text-3xl text-balance mb-4 text-gray-900">Profile Yourself as an Expert</CardTitle>
                  <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Define your primary expertise and supporting skills. Employers search for experts first - make sure you
                    lead with your strongest professional identity.
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-12">
                  <div className="space-y-8 max-w-3xl mx-auto">
                    {/*Primary Skills*/}
                    <div className="border-2 border-primary/20 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <Star className="w-5 h-5 text-primary mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">Your Expertise</h3>
                      </div>
                      <div className="grid gap-4">
                        <div>
                          <TitleSelector
                            onChange={(titles) => {
                              console.log("Selected titles:", titles);
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-4 mt-5">
                        <div className="w-full max-w-2xl">
                          <label htmlFor="industry" className="block mb-1 text-sm font-medium text-gray-700">
                            Your Preferred Industry
                          </label>
                          <input
                            id="industry"
                            type="text"
                            placeholder="Enter your preferred industry"
                            className="block w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200"
                          />
                        </div>
                        <div className="w-full max-w-2xl">
                          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
                            Your Preferred Title
                          </label>
                          <input
                            id="title"
                            type="text"
                            placeholder="Enter your preferred title"
                            className="block w-full rounded-lg border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-red-200"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mt-2">
                          <SkillSelector
                            placeholder="Search and add primary skills"
                            className=""
                            seedItems={skills.map((name, i) => ({ id: String(i), name }))}
                            onChangeBoth={(primary, secondary) => {
                              setExpertiseData((prev: any) => ({
                                ...prev,
                                avatar1: {
                                  ...prev.avatar1,
                                  skills: primary.map((s) => ({ name: s.name, years: s.years ?? 0, proficiency: s.proficiency || "Novice" })),
                                  secondarySkills: secondary.map((s) => ({ name: s.name, years: s.years ?? 0, proficiency: s.proficiency || "Novice" })),
                                },
                              }))
                            }}
                            onCertChange={(cert) => {
                              setExpertiseData((prev: any) => ({
                                ...prev,
                                avatar1: {
                                  ...prev.avatar1,
                                  certification: cert,
                                },
                              }))
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <Card className="border-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center text-primary">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Improve Your ATS Score
                        </CardTitle>
                        <CardDescription>
                          Our professional resume writing service can help you achieve a score of 85+ and get noticed by
                          employers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <h4 className="font-semibold">What you'll get:</h4>
                            <ul className="text-sm space-y-1">
                              <li>✓ ATS-optimized formatting</li>
                              <li>✓ Industry-specific keywords</li>
                              <li>✓ Professional content review</li>
                              <li>✓ Unlimited revisions</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold">Results you can expect:</h4>
                            <ul className="text-sm space-y-1">
                              <li>📈 85+ ATS score guaranteed</li>
                              <li>📧 3x more interview calls</li>
                              <li>⚡ 48-hour turnaround</li>
                              <li>💼 Industry expert writers</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="flex-1">
                            <a href="https://store.y-axis.com/" target="_blank" rel="noopener noreferrer">
                              Get Professional Resume Writing
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                          <Button variant="outline" onClick={() => setCurrentStep("profile")}>
                            Continue to Profile Building
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="text-center">
                      <Button size="lg" onClick={() => handleExpertiseComplete(expertiseData)} className="hover-lift">
                        Continue to Visa & Availability
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ---------------- Visa & Location ---------------- */}
            {currentStep === "visa-availability" && (
              <VisaAvailabilitySection
                value={visaData}
                onChange={(next) => setVisaData(next)}
                onBack={goBack}
                onContinue={(data) => handleVisaComplete(data)}
              />
            )}


            {/* ---------------- Profile 1 ---------------- */}
            {currentStep === "profile" && (
              <div className="animate-slide-up">
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold text-balance mb-4 text-gray-900">Build Your Professional Profile</h2>
                  <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                    Section 1: Personal Information, Education, Work Experience & Projects
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 ">
                  <div className="md:cols-7/12 ">
                    <ProfileSection1 onComplete={handleProfileSection1Complete} apiData={parsedResume?.results?.nova || []} />
                  </div>
                  <div className="md:cols-4/12 shadow-md">
                    <FilePreview file={uploadedFile} />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Button variant="outline" className="bg-transparent" onClick={goBack}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button variant="ghost" onClick={goNext}>
                    Skip 
                  </Button>
                  <Button size="lg" onClick={() => handleProfileSection1Complete(profileData)} className="hover-lift">
                    Continue to Aseessment <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* ---------------- Profile 2 ---------------- */}
            {/* {currentStep === "profile-2" && (
              <div className="animate-slide-up">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-balance mb-4 text-gray-900">Complete Your Profile</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Section 2: Preferences, Licenses, Languages, References & Sponsor Details
                  </p>
                </div>
                <ProfileSection2 onComplete={handleProfileSection2Complete} />
                <div className="mt-6 flex items-center justify-between">
                  <Button variant="outline" className="bg-transparent" onClick={goBack}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button variant="ghost" onClick={goNext}>
                    Skip <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )} */}

            {/* ---------------- Odds Meter ---------------- */}
            {currentStep === "odds-meter" && (
              <div className="space-y-8 animate-slide-up">
                <Card className="shadow-lg border-0 hover-lift">
                  <CardHeader className="text-center pb-8 pt-12">
                    <CardTitle className="text-3xl text-balance mb-4 text-gray-900">
                      Your Competitiveness Assessment
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Based on your expertise, visa status, and profile analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pb-12">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Odds Meter */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Odds Meter</h3>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120" aria-label="Odds vs locals 35 percent">
                            <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
                            <circle cx="60" cy="60" r="45" stroke="rgb(228, 65, 38)" strokeWidth="8" fill="none" strokeDasharray={`${35 * 2.83} 283`} className="transition-all duration-1000" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold" style={{ color: "rgb(228, 65, 38)" }}>35%</div>
                              <div className="text-xs text-gray-500">vs Locals</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Competitiveness against local candidates</p>
                      </div>

                      {/* GI Score */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Global Indian Score</h3>
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120" aria-label="Global Indian score 42">
                            <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
                            <circle cx="60" cy="60" r="45" stroke="rgb(228, 65, 38)" strokeWidth="8" fill="none" strokeDasharray={`${42 * 2.83} 283`} className="transition-all duration-1000" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold" style={{ color: "rgb(228, 65, 38)" }}>42</div>
                              <div className="text-xs text-gray-500">out of 100</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Immigration readiness score</p>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto text-left">
                      <h4 className="font-semibold mb-4" style={{ color: "rgb(228, 65, 38)" }}>Reality Check</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          <div><strong>Visa Status:</strong> Without PR/citizenship, you're competing in a smaller pool with visa sponsorship requirements</div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          <div><strong>Location Flexibility:</strong> Limited mobility reduces available opportunities by 60%</div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          <div><strong>Skills Gap:</strong> Your expertise needs positioning to match local market demands</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                      <Button variant="outline" className="bg-transparent" onClick={goBack}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                      </Button>
                      <Button size="lg" onClick={handleOddsMeterContinue} className="hover-lift">
                        See Your Improvement Path <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}


            {( currentStep === "y-path") && (
              <YPathReview
                profile={{
                  avatarLabel: "Avatar 1",
                  title: "Senior Software Developer",
                  experience: "6-10 years",
                  visaStatus: "Work Visa",
                  availability: "2 weeks notice",
                }}
                competitiveness={{
                  oddsMeter: "35% vs Locals",
                  giScore: "42/100",
                  profileStrength: "Needs Enhancement",
                  recommendedPath: "Career Services",
                }}
                yPath={{
                  immediate: ["Resume rewrite (+25 points)", "LinkedIn optimization", "Job search strategy", "Interview prep"],
                  medium: ["Skills certification", "Professional networking", "Visa pathway consultation", "Industry mentorship"],
                  long: ["PR/citizenship pathway", "Leadership development", "Advanced certifications", "Career advancement"],
                }}
                suggestedServices={[
                  { id: "resume", name: "Professional Resume Rewrite", bullets: ["ATS-optimized", "Role-targeted", "Expert editor"], ctaText: "Select" },
                  { id: "linkedin", name: "LinkedIn Optimization", bullets: ["Headline & About", "SEO keywords", "Recruiter-ready"], ctaText: "Select", variant: "outline" },
                  { id: "interview", name: "Interview Preparation", bullets: ["Mock interviews", "STAR method", "Feedback report"], ctaText: "Select" },
                ]}
                onSelectService={(id) => console.log("Selected service:", id)}
                onBack={goBack}
                onNext={goNext}
              />

            )}

            {/* ---------------- Success ---------------- */}
            {currentStep === "success" && (
              <div className="text-center space-y-6">
                <Card>
                  <CardContent className="pt-8 pb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-balance mb-2">Expert Profile Submitted Successfully!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your comprehensive expertise assessment is now with our Y-axis immigration and career experts.
                    </p>
                    <div className="bg-muted/50 rounded-lg p-6 text-left max-w-2xl mx-auto">
                      <h3 className="font-semibold mb-3">The YAI Way - What happens next?</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">1</div>
                          <div>
                            <p className="font-medium">Expert Analysis (24-48 hours)</p>
                            <p className="text-muted-foreground">
                              Our certified consultants will analyze your expertise profile, competitiveness assessment, and Y-Path recommendations using our 26 years of immigration data.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">2</div>
                          <div>
                            <p className="font-medium">Personalized Consultation</p>
                            <p className="text-muted-foreground">
                              We'll contact you with a curated action plan based on your Avatar 1 expertise, visa status, and career goals - following our principle of ordinary people doing extraordinary work together.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">3</div>
                          <div>
                            <p className="font-medium">Y-Path Activation</p>
                            <p className="text-muted-foreground">
                              Begin your guided journey with points/loyalty tracking, premium membership benefits, and access to our curated marketplace of vetted service providers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                      <Button asChild>
                        <a href="https://store.y-axis.com/" target="_blank" rel="noopener noreferrer">
                          Explore Y-axis Services <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentStep("expertise")
                          setCompleted(new Set())
                        }}
                        size="lg"
                        className="hover-lift"
                      >
                        Start New Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3">Need Immediate Expert Assistance?</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Expert Hotline</div>
                        <div className="text-muted-foreground">+91-40-4555-5555</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Expert Support</div>
                        <div className="text-muted-foreground">experts@y-axis.com</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Live Expert Chat</div>
                        <div className="text-muted-foreground">Available 24/7</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
