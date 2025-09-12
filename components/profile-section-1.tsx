"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, User, GraduationCap, Briefcase, FolderOpen } from "lucide-react"

interface ProfileData {
  // Identity
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  maritalStatus: string
  phoneNumber: string
  email: string
  employmentStatus: string
  landlinePhone: string
  linkedinUrl: string
  gender: string
  nationality: string
  alternatePhone: string
  nickname: string
  skypeId: string
  githubId: string
  currentLocation: string

  // Education
  education: Array<{
    institution: string
    level: string
    fieldOfStudy: string
    degree: string
    country: string
    isHighest: boolean
    attendanceFrom: { month: string; year: string }
    attendanceTo: { month: string; year: string }
    courseType: string
    modeOfStudy: string
    mediumOfEducation: string
    division: string
    percentage: string
    grade: string
    additionalInfo: string
  }>

  // Work Experience
  workExperience: Array<{
    company: string
    role: string
    functionalArea: string
    country: string
    isCurrentRole: boolean
    startDate: { month: string; year: string }
    endDate: { month: string; year: string }
    employmentType: string
    industry: string
    responsibilities: string
    achievements: string
    skills: string[]
    additionalInfo: string
  }>

  // Projects
  projects: Array<{
    name: string
    associatedWith: string
    startDate: { month: string; year: string }
    endDate: { month: string; year: string }
    description: string
  }>
}

interface ProfileSection1Props {
  onComplete: (data: ProfileData) => void
  initialData?: Partial<ProfileData>
}

export default function ProfileSection1({ onComplete, initialData }: ProfileSection1Props) {
  const [activeSection, setActiveSection] = useState<"identity" | "education" | "work" | "projects">("identity")
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: initialData?.firstName || "Aarav",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "Sharma",
    dateOfBirth: initialData?.dateOfBirth || "1995-08-17",
    maritalStatus: initialData?.maritalStatus || "single",
    phoneNumber: initialData?.phoneNumber || "9876543210",
    email: initialData?.email || "aarav.sharma@example.com",
    employmentStatus: initialData?.employmentStatus || "employed",
    landlinePhone: initialData?.landlinePhone || "040-4000-0000",
    linkedinUrl: initialData?.linkedinUrl || "https://linkedin.com/in/aarav-sharma",
    gender: initialData?.gender || "male",
    nationality: initialData?.nationality || "indian",
    alternatePhone: initialData?.alternatePhone || "9000000000",
    nickname: initialData?.nickname || "Ray",
    skypeId: initialData?.skypeId || "live:aarav_sharma",
    githubId: initialData?.githubId || "https://github.com/aarav-dev",
    currentLocation: initialData?.currentLocation || "india",
    education: initialData?.education || [
      {
        institution: "Hyderabad Institute of Technology & Management",
        level: "bachelors",
        fieldOfStudy: "Computer Science",
        degree: "B.Tech (Computer Science & Engineering)",
        country: "india",
        isHighest: true,
        attendanceFrom: { month: "July", year: "2013" },
        attendanceTo: { month: "May", year: "2017" },
        courseType: "Full-time",
        modeOfStudy: "On-campus",
        mediumOfEducation: "English",
        division: "First Class with Distinction",
        percentage: "82",
        grade: "A",
        additionalInfo: "Final-year project on scalable event processing with Kafka",
      },
    ],
    workExperience: initialData?.workExperience || [
      {
        company: "CloudCart Labs Pvt. Ltd.",
        role: "Senior Software Engineer",
        functionalArea: "Full-Stack Development",
        country: "india",
        isCurrentRole: true,
        startDate: { month: "January", year: "2022" },
        endDate: { month: "", year: "" },
        employmentType: "Full-time",
        industry: "E-commerce SaaS",
        responsibilities:
          "Built multi-tenant storefront builder with React/Next.js and Node.js microservices. Designed event-driven order pipeline; integrated payments, inventory, and search. Implemented CI/CD on AWS (ECS, RDS, SQS), infra as code with Terraform.",
        achievements:
          "Cut p95 page load from 3.8s → 1.9s; increased checkout conversion by 7.4%. Reduced infra cost by 18% via autoscaling and query tuning.",
        skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes"],
        additionalInfo: "Mentored 4 interns; led security hardening initiative.",
      },
      {
        company: "FinNova Technologies",
        role: "Software Engineer",
        functionalArea: "Backend & Integrations",
        country: "india",
        isCurrentRole: false,
        startDate: { month: "July", year: "2017" },
        endDate: { month: "December", year: "2021" },
        employmentType: "Full-time",
        industry: "FinTech",
        responsibilities:
          "Built loan origination APIs; integrated KYC, AML, and credit scoring partners. Created internal dashboards for risk and collections (Express + React).",
        achievements:
          "Reduced underwriting decision time by 35% with rules-engine rollout. Decreased delinquency by 2.3% via better risk features.",
        skills: ["Node.js", "Express", "React", "MongoDB", "RabbitMQ", "Docker"],
        additionalInfo: "Presented at company tech talks on event-driven design.",
      },
    ],
    projects: initialData?.projects || [
      {
        name: "Global Jobs Aggregator",
        associatedWith: "Personal",
        startDate: { month: "March", year: "2024" },
        endDate: { month: "", year: "" },
        description:
          "Unified 30+ job sources; deduped postings; added search with embeddings and filters. Stack: Next.js, Node.js, PostgreSQL, Elasticsearch, Docker.",
      },
    ],
  })

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString())

  const addEducation = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          level: "",
          fieldOfStudy: "",
          degree: "",
          country: "",
          isHighest: false,
          attendanceFrom: { month: "", year: "" },
          attendanceTo: { month: "", year: "" },
          courseType: "",
          modeOfStudy: "",
          mediumOfEducation: "",
          division: "",
          percentage: "",
          grade: "",
          additionalInfo: "",
        },
      ],
    }))
  }

  const addWorkExperience = () => {
    setProfileData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: "",
          role: "",
          functionalArea: "",
          country: "",
          isCurrentRole: false,
          startDate: { month: "", year: "" },
          endDate: { month: "", year: "" },
          employmentType: "",
          industry: "",
          responsibilities: "",
          achievements: "",
          skills: [],
          additionalInfo: "",
        },
      ],
    }))
  }

  const addProject = () => {
    setProfileData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          associatedWith: "",
          startDate: { month: "", year: "" },
          endDate: { month: "", year: "" },
          description: "",
        },
      ],
    }))
  }

  const removeEducation = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const removeWorkExperience = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }))
  }

  const removeProject = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const sections = [
    { id: "identity", label: "Identity", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "work", label: "Work Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderOpen },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </Button>
          )
        })}
      </div>

      {/* Identity Section */}
      {activeSection === "identity" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Identity Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Aarav"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name (Optional)</Label>
                <Input
                  id="middleName"
                  value={profileData.middleName}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, middleName: e.target.value }))}
                  placeholder="Middle Name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Sharma"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status *</Label>
                <Select
                  value={profileData.maritalStatus}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, maritalStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Marital Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select defaultValue="+91">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">+91</SelectItem>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="9876543210"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="aarav.sharma@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select
                  value={profileData.employmentStatus}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, employmentStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select
                  value={profileData.nationality}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, nationality: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="british">British</SelectItem>
                    <SelectItem value="canadian">Canadian</SelectItem>
                    <SelectItem value="australian">Australian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                <Input
                  id="linkedinUrl"
                  value={profileData.linkedinUrl}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubId">GitHub Profile (Optional)</Label>
                <Input
                  id="githubId"
                  value={profileData.githubId}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, githubId: e.target.value }))}
                  placeholder="GitHub ID"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentLocation">Current Location *</Label>
              <Select
                value={profileData.currentLocation}
                onValueChange={(value) => setProfileData((prev) => ({ ...prev, currentLocation: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {activeSection === "education" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.education.map((edu, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Education {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].institution = e.target.value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                      placeholder="Ex: Boston University"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Level of Education *</Label>
                    <Select
                      value={edu.level}
                      onValueChange={(value) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].level = value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].fieldOfStudy = e.target.value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                      placeholder="Ex: Electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree/Course Name *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].degree = e.target.value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                      placeholder="Ex: Bachelor in Engineering"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`highest-${index}`}
                    checked={edu.isHighest}
                    onCheckedChange={(checked) => {
                      const newEducation = [...profileData.education]
                      newEducation[index].isHighest = checked as boolean
                      setProfileData((prev) => ({ ...prev, education: newEducation }))
                    }}
                  />
                  <Label htmlFor={`highest-${index}`}>This is my highest level of education</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Percentage/Grade</Label>
                    <Input
                      value={edu.percentage}
                      onChange={(e) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].percentage = e.target.value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                      placeholder="Percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={edu.country}
                      onValueChange={(value) => {
                        const newEducation = [...profileData.education]
                        newEducation[index].country = value
                        setProfileData((prev) => ({ ...prev, education: newEducation }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Work Experience Section */}
      {activeSection === "work" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.workExperience.map((work, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Work Experience {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWorkExperience(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      value={work.company}
                      onChange={(e) => {
                        const newWork = [...profileData.workExperience]
                        newWork[index].company = e.target.value
                        setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                      }}
                      placeholder="Ex: Microsoft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role *</Label>
                    <Input
                      value={work.role}
                      onChange={(e) => {
                        const newWork = [...profileData.workExperience]
                        newWork[index].role = e.target.value
                        setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                      }}
                      placeholder="Ex: UX Designer"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Functional Area/Domain *</Label>
                    <Input
                      value={work.functionalArea}
                      onChange={(e) => {
                        const newWork = [...profileData.workExperience]
                        newWork[index].functionalArea = e.target.value
                        setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                      }}
                      placeholder="Ex: Design"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={work.country}
                      onValueChange={(value) => {
                        const newWork = [...profileData.workExperience]
                        newWork[index].country = value
                        setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={work.isCurrentRole}
                    onCheckedChange={(checked) => {
                      const newWork = [...profileData.workExperience]
                      newWork[index].isCurrentRole = checked as boolean
                      setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                    }}
                  />
                  <Label htmlFor={`current-${index}`}>I am currently working in this role</Label>
                </div>

                <div className="space-y-2">
                  <Label>Job Responsibilities (Optional)</Label>
                  <Textarea
                    value={work.responsibilities}
                    onChange={(e) => {
                      const newWork = [...profileData.workExperience]
                      newWork[index].responsibilities = e.target.value
                      setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                    }}
                    placeholder="Enter Job responsibilities"
                    className="min-h-20"
                  />
                  <p className="text-sm text-muted-foreground">0/200</p>
                </div>

                <div className="space-y-2">
                  <Label>Key Achievements (Optional)</Label>
                  <Textarea
                    value={work.achievements}
                    onChange={(e) => {
                      const newWork = [...profileData.workExperience]
                      newWork[index].achievements = e.target.value
                      setProfileData((prev) => ({ ...prev, workExperience: newWork }))
                    }}
                    placeholder="Enter Key Achievements"
                    className="min-h-20"
                  />
                  <p className="text-sm text-muted-foreground">0/200</p>
                </div>
              </div>
            ))}

            <Button onClick={addWorkExperience} variant="outline" className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Work Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Projects Section */}
      {activeSection === "projects" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Project {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => {
                        const newProjects = [...profileData.projects]
                        newProjects[index].name = e.target.value
                        setProfileData((prev) => ({ ...prev, projects: newProjects }))
                      }}
                      placeholder="Ex: VR in Gaming"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Associated With *</Label>
                    <Input
                      value={project.associatedWith}
                      onChange={(e) => {
                        const newProjects = [...profileData.projects]
                        newProjects[index].associatedWith = e.target.value
                        setProfileData((prev) => ({ ...prev, projects: newProjects }))
                      }}
                      placeholder="Ex: Google"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...profileData.projects]
                      newProjects[index].description = e.target.value
                      setProfileData((prev) => ({ ...prev, projects: newProjects }))
                    }}
                    placeholder="Describe your project..."
                    className="min-h-24"
                  />
                </div>
              </div>
            ))}

            <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline">Back to ATS Score</Button>
        <Button onClick={() => onComplete(profileData)}>Continue to Section 2</Button>
      </div>
    </div>
  )
}
