"use client"

import type React from "react"
import ProfileSection1 from "@/components/profile-section-1"
import ProfileSection2 from "@/components/profile-section-2"
import { Upload, ExternalLink, User, CheckCircle, Target, Star, MapPin, Clock } from "lucide-react"
import Image from "next/image"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import SkillSelector from "@/components/skill-selector"

const softwareSkills = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "TypeScript",
  "React.js",
  "Node.js",
  "Express.js",
  "Next.js",
  "MongoDB",
  "SQL",
  "HTML",
  "CSS",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "REST APIs",
  "Agile Methodologies"
].slice(0, 20);


export default function YTPHomePage() {
  const [currentStep, setCurrentStep] = useState<
    | "expertise"
    | "visa-availability"
    | "upload"
    | "profile-1"
    | "profile-2"
    | "odds-meter"
    | "y-path"
    | "review"
    | "success"
  >("upload")

  const [expertiseData, setExpertiseData] = useState<any>({
    avatar1: { role: "", experience: "", skills: [] },
    avatar2: { role: "", experience: "", skills: [] },
    avatar3: { role: "", experience: "", skills: [] },
  })
  const [visaData, setVisaData] = useState<any>({
    status: "",
    location: "",
    availability: "",
    relocate: "",
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null)
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

  const getStepProgress = () => {
    const steps = [
      "upload", 
      "expertise",
      "visa-availability",
      "profile-1",
      "profile-2",
      "odds-meter",
      "y-path",
      "review",
      "success",
    ]
    const currentIndex = steps.indexOf(currentStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current)
    }
    setIsUploading(true)
    setUploadProgress(0)
    if (carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current)
    }
    setCarouselIndex(0)
    carouselIntervalRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % resumeTips.length)
    }, 1000)

    const durationMs = 5000
    const steps = 30
    const stepMs = durationMs / steps
    let tick = 0
    uploadIntervalRef.current = setInterval(() => {
      tick += 1
      const next = Math.min(100, Math.round((tick / steps) * 100))
      setUploadProgress(next)
      if (tick >= steps) {
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current)
        uploadIntervalRef.current = null
        if (carouselIntervalRef.current) clearInterval(carouselIntervalRef.current)
        carouselIntervalRef.current = null
        setIsUploading(false)
        setCurrentStep("expertise")
      }
    }, stepMs)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === "application/pdf") {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleExpertiseComplete = (data: any) => {
    setExpertiseData(data)
    setCurrentStep("visa-availability")
  }

  const handleVisaComplete = (data: any) => {
    setVisaData(data)
    setCurrentStep("profile-1")
  }

  const handleProfileSection1Complete = (data: any) => {
    setProfileData((prev: any) => ({ ...prev, section1: data }))
    setCurrentStep("profile-2")
  }

  const handleProfileSection2Complete = (data: any) => {
    setProfileData((prev: any) => ({ ...prev, section2: data }))
    setCurrentStep("odds-meter")
  }

  const handleOddsMeterContinue = () => {
    setCurrentStep("y-path")
  }

  const handleYPathContinue = () => {
    setCurrentStep("review")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/y-axis-logo.png" alt="Y-axis Logo" width={140} height={45} className="h-12 w-auto" />
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Talent Pool</h1>
                <p className="text-sm text-gray-600">Expert-Led Career Platform</p>
              </div>
            </div>
            <Button variant="outline" size="lg" className="hover-lift bg-transparent">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6 text-xs">
            <div
              className={cn(
                "flex items-center space-x-2",
                currentStep === "upload" ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  currentStep === "upload"
                    ? "border-primary bg-primary text-white"
                    : ["profile-1", "profile-2", "odds-meter", "y-path", "review", "success"].includes(currentStep)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {["profile-1", "profile-2", "odds-meter", "y-path", "review", "success"].includes(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="font-semibold">Resume</span>
            </div>
            {/* Expertise (now second) */}
            <div
              className={cn(
                "flex items-center space-x-2",
                currentStep === "expertise" ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  currentStep === "expertise"
                    ? "border-primary bg-primary text-white"
                    : [
                          "visa-availability",
                          "profile-1",
                          "profile-2",
                          "odds-meter",
                          "y-path",
                          "review",
                          "success",
                        ].includes(currentStep)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {[
                  "visa-availability",
                  "profile-1",
                  "profile-2",
                  "odds-meter",
                  "y-path",
                  "review",
                  "success",
                ].includes(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  "2"
                )}
              </div>
              <span className="font-semibold">Expertise</span>
            </div>
            {/* Visa & Location (now third) */}
            <div
              className={cn(
                "flex items-center space-x-2",
                currentStep === "visa-availability" ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  currentStep === "visa-availability"
                    ? "border-primary bg-primary text-white"
                    : ["profile-1", "profile-2", "odds-meter", "y-path", "review", "success"].includes(
                          currentStep,
                        )
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {["profile-1", "profile-2", "odds-meter", "y-path", "review", "success"].includes(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  "3"
                )}
              </div>
              <span className="font-semibold">Visa & Location</span>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2",
                ["profile-1", "profile-2"].includes(currentStep) ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  ["profile-1", "profile-2"].includes(currentStep)
                    ? "border-primary bg-primary text-white"
                    : ["odds-meter", "y-path", "review", "success"].includes(currentStep)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {["odds-meter", "y-path", "review", "success"].includes(currentStep) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  "4"
                )}
              </div>
              <span className="font-semibold">Profile</span>
            </div>
            <div
              className={cn(
                "flex items-center space-x-2",
                currentStep === "odds-meter" ? "text-primary scale-105" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  currentStep === "odds-meter"
                    ? "border-primary bg-primary text-white"
                    : ["y-path", "review", "success"].includes(currentStep)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300",
                )}
              >
                {["y-path", "review", "success"].includes(currentStep) ? <CheckCircle className="w-4 h-4" /> : "5"}
              </div>
              <span className="font-semibold">Assessment</span>
            </div>
          </div>
          <Progress value={getStepProgress()} className="h-3 bg-gray-100" />
        </div>

        {currentStep === "expertise" && (
          <Card className="mb-12 hover-lift animate-slide-up shadow-lg border-0">
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-3xl text-balance mb-4 text-gray-900">Profile Yourself as an Expert</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Define your primary expertise and supporting skills. Employers search for experts first - make sure you
                lead with your strongest professional identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="space-y-8 max-w-3xl mx-auto">
                {/*Primary Skills*/}
                <div className="border-2 border-primary/20 rounded-xl p-6 bg-primary/5">
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-primary mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Your Primary Expertise</h3>
                    <Badge className="ml-2 bg-primary">PRIORITY</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="avatar1-role">Professional Role/Title</Label>
                      <Input
                        id="avatar1-role"
                        placeholder="e.g., Senior Salesforce Consultant, Java Developer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="avatar1-experience">Years of Experience</Label>
                      <Select>
                        <SelectTrigger className="mt-1 bg-white">
                          <SelectValue placeholder="Select experience" />
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
                  <div className="mt-4">
                    <div className="mt-2">
                      <SkillSelector
                        placeholder="Search and add primary skills"
                        className=""
                        seedItems={softwareSkills.map((name, i) => ({ id: String(i), name }))}
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
                <div className="text-center">
                  <Button size="lg" onClick={() => handleExpertiseComplete(expertiseData)} className="hover-lift">
                    Continue to Visa & Availability
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === "visa-availability" && (
          <Card className="mb-12 hover-lift animate-slide-up shadow-lg border-0">
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-3xl text-balance mb-4 text-gray-900">Visa Status & Availability</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your visa status and location preferences are critical for matching with the right opportunities. Be
                specific about your availability and mobility.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="visa-status" className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Current Visa Status
                    </Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select visa status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="pr">Permanent Resident</SelectItem>
                        <SelectItem value="work-visa">Work Visa</SelectItem>
                        <SelectItem value="student-visa">Student Visa</SelectItem>
                        <SelectItem value="visitor">Visitor/Tourist</SelectItem>
                        <SelectItem value="no-visa">No Current Visa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="current-location" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Current Location
                    </Label>
                    <Input id="current-location" placeholder="e.g., Sydney, Melbourne, Brisbane" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability" className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Immediate Availability
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="When can you start?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                      <SelectItem value="1-month">1 month notice</SelectItem>
                      <SelectItem value="2-months">2+ months</SelectItem>
                      <SelectItem value="not-looking">Not actively looking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="relocate">Willing to Relocate?</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Relocation preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes-anywhere">Yes, anywhere</SelectItem>
                      <SelectItem value="yes-major-cities">Yes, major cities only</SelectItem>
                      <SelectItem value="same-state">Within same state/region</SelectItem>
                      <SelectItem value="no">No, current location only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Why This Matters</h4>
                  <p className="text-sm text-blue-800">
                    Employers prioritize candidates who are immediately available and have the right to work. Your visa
                    status and location directly impact your competitiveness in the job market.
                  </p>
                </div>

                <div className="text-center">
                  <Button size="lg" onClick={() => handleVisaComplete(visaData)} className="hover-lift">
                    Continue to Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume Upload - now step 1 */}
        {currentStep === "upload" && (
          <Card className="mb-12 hover-lift animate-slide-up shadow-lg border-0">
            <CardHeader className="text-center pb-8 pt-12">
              <CardTitle className="text-3xl text-balance mb-4 text-gray-900">Upload Your Resume</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start by uploading your resume. We'll use it to tailor the next steps of your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer",
                  isDragOver ? "border-primary bg-primary/5 scale-105" : "border-gray-300 bg-gray-50/50",
                  "hover:border-primary hover:bg-primary/5 hover:scale-105",
                )}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                {!isUploading ? (
                  <>
                    <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Drop your resume here</h3>
                    <p className="text-gray-600 mb-6">or click to browse files</p>
                    <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="resume-upload" />
                    <label htmlFor="resume-upload">
                      <Button asChild size="lg" className="hover-lift">
                        <span>Choose File</span>
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 mt-4">PDF files only, max 10MB</p>
                  </>
                ) : (
                  <>
                    <div className="text-left max-w-md mx-auto">
                      <div className="h-20 overflow-hidden rounded-md bg-white/70 border border-gray-200 flex items-center justify-center">
                        <div className="text-sm text-gray-700 px-4 text-center">
                          {resumeTips[carouselIndex]}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 text-left max-w-md mx-auto">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Uploading…</span>
                        <span className="text-sm text-gray-700">{uploadProgress}%</span>
                      </div>
                      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-100 ease-linear"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Building Section 1 */}
        {currentStep === "profile-1" && (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-balance mb-4 text-gray-900">Build Your Professional Profile</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Section 1: Personal Information, Education, Work Experience & Projects
              </p>
            </div>
            <ProfileSection1 onComplete={handleProfileSection1Complete} />
          </div>
        )}

        {/* Profile Building Section 2 */}
        {currentStep === "profile-2" && (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-balance mb-4 text-gray-900">Complete Your Profile</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Section 2: Preferences, Licenses, Languages, References & Sponsor Details
              </p>
            </div>
            <ProfileSection2 onComplete={handleProfileSection2Complete} />
          </div>
        )}

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
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          stroke="rgb(228, 65, 38)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${35 * 2.83} ${283}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold" style={{ color: "rgb(228, 65, 38)" }}>
                            35%
                          </div>
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
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          stroke="rgb(228, 65, 38)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${42 * 2.83} ${283}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold" style={{ color: "rgb(228, 65, 38)" }}>
                            42
                          </div>
                          <div className="text-xs text-gray-500">out of 100</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Immigration readiness score</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto text-left">
                  <h4 className="font-semibold mb-4" style={{ color: "rgb(228, 65, 38)" }}>
                    Reality Check
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <div>
                        <strong>Visa Status:</strong> Without PR/citizenship, you're competing in a smaller pool with
                        visa sponsorship requirements
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <div>
                        <strong>Location Flexibility:</strong> Limited mobility reduces available opportunities by 60%
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <div>
                        <strong>Skills Gap:</strong> Your expertise needs positioning to match local market demands
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button size="lg" onClick={handleOddsMeterContinue} className="hover-lift">
                    See Your Improvement Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "y-path" && (
          <div className="space-y-8 animate-slide-up">
            <Card className="shadow-lg border-0 hover-lift">
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-3xl text-balance mb-4 text-gray-900">Your Y-Path Journey</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Personalized roadmap to improve your competitiveness and achieve your career goals
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Immediate Actions */}
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">Immediate (0-3 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Professional resume rewrite (+25 points)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          LinkedIn optimization
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Job search strategy (JSS)
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          Interview preparation
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Medium-term */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Medium-term (3-12 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">○</span>
                          Skills certification programs
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">○</span>
                          Professional networking
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">○</span>
                          Visa pathway consultation
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">○</span>
                          Industry mentorship
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Long-term */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Long-term (1-3 years)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2">○</span>
                          PR/citizenship pathway
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2">○</span>
                          Leadership development
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2">○</span>
                          Advanced certifications
                        </li>
                        <li className="flex items-start">
                          <span className="text-gray-400 mr-2">○</span>
                          Career advancement
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-primary">Recommended: Start with JSS Premium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">What's included:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Professional resume rewrite</li>
                          <li>• LinkedIn profile optimization</li>
                          <li>• Job search strategy & coaching</li>
                          <li>• Interview preparation</li>
                          <li>• 90-day job placement support</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expected outcomes:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Odds Meter: 35% → 65%</li>
                          <li>• 3x more interview calls</li>
                          <li>• 40% faster job placement</li>
                          <li>• 15-25% salary increase</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button asChild className="flex-1">
                        <a href="https://store.y-axis.com/" target="_blank" rel="noopener noreferrer">
                          Start JSS Premium
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="outline" onClick={handleYPathContinue} className="flex-1 bg-transparent">
                        Continue to Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Section */}
        {currentStep === "review" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center text-primary">
                  <Target className="w-5 h-5 mr-2" />
                  Review Your Expert Profile
                </CardTitle>
                <CardDescription>Your comprehensive professional assessment is ready for expert review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Expertise Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Primary Expertise
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avatar 1:</span>
                        <span className="font-medium">Senior Software Developer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">6-10 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Visa Status:</span>
                        <span className="font-medium">Work Visa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className="font-medium">2 weeks notice</span>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Competitiveness Assessment
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Odds Meter:</span>
                        <span className="font-medium text-destructive">35% vs Locals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GI Score:</span>
                        <span className="font-medium text-destructive">42/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profile Strength:</span>
                        <span className="font-medium">Needs Enhancement</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recommended Path:</span>
                        <span className="font-medium text-primary">JSS Premium</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Y-Path Summary */}
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Your Y-Path Journey</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Immediate (0-3 months):</strong>
                      <p>JSS Premium - Resume + Job Search Strategy</p>
                    </div>
                    <div>
                      <strong>Medium-term (3-12 months):</strong>
                      <p>Skills certification + Visa consultation</p>
                    </div>
                    <div>
                      <strong>Long-term (1-3 years):</strong>
                      <p>PR pathway + Career advancement</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    By submitting this profile, you agree to our terms of service and privacy policy. Our expert
                    consultants will review your profile and contact you within 24-48 hours with personalized
                    recommendations based on the YAI Way principles.
                  </p>
                  <Button size="lg" onClick={() => setCurrentStep("success")} className="w-full sm:w-auto">
                    Submit for Expert Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Section */}
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
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Expert Analysis (24-48 hours)</p>
                        <p className="text-muted-foreground">
                          Our certified consultants will analyze your expertise profile, competitiveness assessment, and
                          Y-Path recommendations using our 26 years of immigration data.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Personalized Consultation</p>
                        <p className="text-muted-foreground">
                          We'll contact you with a curated action plan based on your Avatar 1 expertise, visa status,
                          and career goals - following our principle of ordinary people doing extraordinary work
                          together.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Y-Path Activation</p>
                        <p className="text-muted-foreground">
                          Begin your guided journey with points/loyalty tracking, premium membership benefits, and
                          access to our curated marketplace of vetted service providers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    📧 Check your email ({profileData?.section1?.email || "your registered email"}) for confirmation and
                    next steps.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                  <Button asChild>
                    <a href="https://store.y-axis.com/" target="_blank" rel="noopener noreferrer">
                      Explore Y-axis Services
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("expertise")}
                    size="lg"
                    className="hover-lift"
                  >
                    Start New Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
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
      </main>
    </div>
  )
}
