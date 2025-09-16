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

interface ApiProfileData {
  "Profile summary or career objective"?: string
  "First Name"?: string
  "Last Name"?: string
  "Email or E-mail"?: string
  "Mobile Phone"?: string
  "LinkedIn Profile"? : string
  Address?: string
  Skills?: string[]
  "Work Experiences"?: Array<{
    "Job Title"?: string
    "Company Name"?: string
    Duration?: string
    "Job Description"?: string
    "Start date"?: string
    "End date"?: string
  }>
  Educations?: Array<{
    Institution?: string
    "Start date"?: string
    "End date"?: string
    Degree?: string
  }>
  Certifications?: Array<{
    Authority?: string
    Name?: string
    "Issue date"?: string
  }>
}

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
  profileSummary: string
  skills: string[]
  address: string

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

  certifications: Array<{
    name: string
    authority: string
    issueDate: string
  }>
}

interface ProfileSection1Props {
  onComplete: (data: ProfileData) => void
  initialData?: Partial<ProfileData>
  apiData?: ApiProfileData
}

export default function ProfileSection1({ onComplete, initialData, apiData }: ProfileSection1Props) {
  console.log("API Data:", apiData)
  const transformApiData = (api: ApiProfileData): Partial<ProfileData> => {
    return {
      firstName: api["First Name"] || "",
      lastName: api["Last Name"] || "",
      email: api["Email or E-mail"] || "",
      phoneNumber: api["Mobile Phone"] || "",
      address: api["Address"] || "",
      profileSummary: api["Profile summary or career objective"] || "",
      skills: api["Skills"] || [],
      linkedinUrl: api['LinkedIn Profile'] || "",
      workExperience:
        api["Work Experiences"]?.map((work) => ({
          company: work["Company Name"] || "",
          role: work["Job Title"] || "",
          functionalArea: "",
          country: "india",
          isCurrentRole:
            work["End date"]?.toLowerCase().includes("till date") ||
            work["End date"]?.toLowerCase().includes("current") ||
            false,
          startDate: { month: "", year: work["Start date"] || "" },
          endDate: { month: "", year: work["End date"] || "" },
          employmentType: "Full-time",
          industry: "",
          responsibilities: work["Job Description"] || "",
          achievements: "",
          skills: [],
          additionalInfo: work["Duration"] || "",
        })) || [],
      education:
        api["Educations"]?.map((edu) => ({
          institution: edu["Institution"] || "",
          level: "bachelors",
          fieldOfStudy: "",
          degree: edu["Degree"] || "",
          country: "india",
          isHighest: false,
          attendanceFrom: { month: "", year: edu["Start date"] || "" },
          attendanceTo: { month: "", year: edu["End date"] || "" },
          courseType: "Full-time",
          modeOfStudy: "On-campus",
          mediumOfEducation: "English",
          division: "",
          percentage: "",
          grade: "",
          additionalInfo: "",
        })) || [],
      certifications:
        api["Certifications"]?.map((cert) => ({
          name: cert["Name"] || "",
          authority: cert["Authority"] || "",
          issueDate: cert["Issue date"] || "",
        })) || [],
    }
  }

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: apiData ? transformApiData(apiData).firstName || "" : '',
    middleName: initialData?.middleName || "",
    lastName: apiData ? transformApiData(apiData).lastName || "" : initialData?.lastName || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    maritalStatus: initialData?.maritalStatus || "",
    phoneNumber: apiData
      ? transformApiData(apiData).phoneNumber || ""
      : initialData?.phoneNumber || "",
    email: apiData
      ? transformApiData(apiData).email || ""
      : initialData?.email || "",
    employmentStatus: initialData?.employmentStatus || "",
    landlinePhone: initialData?.landlinePhone || "",
    linkedinUrl: apiData ? transformApiData(apiData).linkedinUrl || "" : initialData?.linkedinUrl || "",
    gender: initialData?.gender || "",
    nationality: initialData?.nationality || "",
    alternatePhone: initialData?.alternatePhone || "",
    nickname: initialData?.nickname || "",
    skypeId: initialData?.skypeId || "",
    githubId: initialData?.githubId || "",
    currentLocation: initialData?.currentLocation || "",
    profileSummary: apiData ? transformApiData(apiData).profileSummary || "" : "",
    skills: apiData ? transformApiData(apiData).skills || [] : [],
    address: apiData ? transformApiData(apiData).address || "" : "",
    education: apiData ? transformApiData(apiData).education || [] : initialData?.education || [],
    workExperience: apiData ? transformApiData(apiData).workExperience || []: initialData?.workExperience || [],
    projects: initialData?.projects || [],
    certifications: apiData ? transformApiData(apiData).certifications || [] : [],
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

  const addCertification = () => {
    setProfileData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          authority: "",
          issueDate: "",
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

  const removeCertification = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {profileData.profileSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="profileSummary">Career Objective</Label>
              <Textarea
                id="profileSummary"
                value={profileData.profileSummary}
                onChange={(e) => setProfileData((prev) => ({ ...prev, profileSummary: e.target.value }))}
                placeholder="Enter your career objective..."
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Identity Section */}
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
                  {/* <SelectItem value="" disabled>Select</SelectItem> */}
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

          {profileData.address && (
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your address"
              />
            </div>
          )}

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

          {profileData.skills.length > 0 && (
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
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

      {/* Work Experience Section */}
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

      {/* Projects Section */}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileData.certifications.map((cert, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Certification {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCertification(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name *</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => {
                      const newCertifications = [...profileData.certifications]
                      newCertifications[index].name = e.target.value
                      setProfileData((prev) => ({ ...prev, certifications: newCertifications }))
                    }}
                    placeholder="Ex: AWS Certified Solutions Architect"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuing Authority</Label>
                  <Input
                    value={cert.authority}
                    onChange={(e) => {
                      const newCertifications = [...profileData.certifications]
                      newCertifications[index].authority = e.target.value
                      setProfileData((prev) => ({ ...prev, certifications: newCertifications }))
                    }}
                    placeholder="Ex: Amazon Web Services"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input
                  value={cert.issueDate}
                  onChange={(e) => {
                    const newCertifications = [...profileData.certifications]
                    newCertifications[index].issueDate = e.target.value
                    setProfileData((prev) => ({ ...prev, certifications: newCertifications }))
                  }}
                  placeholder="Ex: 2023"
                />
              </div>
            </div>
          ))}

          <Button onClick={addCertification} variant="outline" className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      </Card>


      {/* Navigation */}
      {/* <div className="flex justify-between mt-8">
        <Button variant="outline">Back to ATS Score</Button>
        </div> */}
      {/* <Button onClick={() => onComplete(profileData)}>Continue</Button> */}
    </div>
  )
}