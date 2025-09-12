"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Settings, Award, Globe, Users, Building } from "lucide-react"

interface ProfileSection2Data {
  // Needs & Preferences
  employmentStatus: string
  preferredCountries: string[]
  preferredDesignations: string[]
  preferredIndustries: string[]
  keySkills: string[]
  preferredEmploymentType: string
  willingToTravel: boolean

  // Work Authorization
  hasWorkAuthorization: string

  // Licenses & Certifications
  licenses: Array<{
    name: string
    issuingOrganization: string
    issueDate: { month: string; year: string }
    expiryDate: { month: string; year: string }
    doesNotExpire: boolean
    credentialId: string
    credentialUrl: string
  }>

  // Licensure
  requiresLicensure: string
  licenseName: string
  issuingAuthority: string
  licenseNumber: string
  licenseExpiryDate: string

  // Languages & Global Exposure
  languages: Array<{
    language: string
    proficiency: string
    listening: string
    speaking: string
    reading: string
    writing: string
  }>

  // Travel History
  travelHistory: Array<{
    country: string
    purpose: string
    startDate: string
    endDate: string
    visaCategory: string
  }>

  // References
  references: Array<{
    name: string
    organization: string
    designation: string
    relationship: string
    yourPosition: string
    phone: string
    email: string
  }>

  // Sponsor Details
  sponsorDetails: {
    country: string
    visaName: string
    sponsorName: string
    contactPersonName: string
    designation: string
    telephone: string
    email: string
    website: string
  }

  // Assessment Questions
  age: string
  levelOfStudyInterested: string
  highestEducation: string
  stream: string
  specialization: string
  percentage: string
  budget: string
  mediumOfEducation: string
  yearsOfWork: string
  currentLocation: string
  state: string
  workingAs: string
  applyingFor: string
  numberOfApplicants: string
}

interface ProfileSection2Props {
  onComplete: (data: ProfileSection2Data) => void
  initialData?: Partial<ProfileSection2Data>
}

export default function ProfileSection2({ onComplete, initialData }: ProfileSection2Props) {
  const [activeSection, setActiveSection] = useState<
    "preferences" | "authorization" | "licenses" | "languages" | "references" | "sponsor" | "assessment"
  >("preferences")

  const [profileData, setProfileData] = useState<ProfileSection2Data>({
    employmentStatus: initialData?.employmentStatus || "",
    preferredCountries: initialData?.preferredCountries || [],
    preferredDesignations: initialData?.preferredDesignations || [],
    preferredIndustries: initialData?.preferredIndustries || [],
    keySkills: initialData?.keySkills || [],
    preferredEmploymentType: initialData?.preferredEmploymentType || "",
    willingToTravel: initialData?.willingToTravel || false,
    hasWorkAuthorization: initialData?.hasWorkAuthorization || "",
    licenses: initialData?.licenses || [],
    requiresLicensure: initialData?.requiresLicensure || "",
    licenseName: initialData?.licenseName || "",
    issuingAuthority: initialData?.issuingAuthority || "",
    licenseNumber: initialData?.licenseNumber || "",
    licenseExpiryDate: initialData?.licenseExpiryDate || "",
    languages: initialData?.languages || [],
    travelHistory: initialData?.travelHistory || [],
    references: initialData?.references || [],
    sponsorDetails: initialData?.sponsorDetails || {
      country: "",
      visaName: "",
      sponsorName: "",
      contactPersonName: "",
      designation: "",
      telephone: "",
      email: "",
      website: "",
    },
    age: initialData?.age || "",
    levelOfStudyInterested: initialData?.levelOfStudyInterested || "",
    highestEducation: initialData?.highestEducation || "",
    stream: initialData?.stream || "",
    specialization: initialData?.specialization || "",
    percentage: initialData?.percentage || "",
    budget: initialData?.budget || "",
    mediumOfEducation: initialData?.mediumOfEducation || "",
    yearsOfWork: initialData?.yearsOfWork || "",
    currentLocation: initialData?.currentLocation || "",
    state: initialData?.state || "",
    workingAs: initialData?.workingAs || "",
    applyingFor: initialData?.applyingFor || "",
    numberOfApplicants: initialData?.numberOfApplicants || "",
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

  const sections = [
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "authorization", label: "Authorization", icon: Award },
    { id: "licenses", label: "Licenses", icon: Award },
    { id: "languages", label: "Languages", icon: Globe },
    { id: "references", label: "References", icon: Users },
    { id: "sponsor", label: "Sponsor", icon: Building },
    { id: "assessment", label: "Assessment", icon: Settings },
  ]

  const addLicense = () => {
    setProfileData((prev) => ({
      ...prev,
      licenses: [
        ...prev.licenses,
        {
          name: "",
          issuingOrganization: "",
          issueDate: { month: "", year: "" },
          expiryDate: { month: "", year: "" },
          doesNotExpire: false,
          credentialId: "",
          credentialUrl: "",
        },
      ],
    }))
  }

  const addLanguage = () => {
    setProfileData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          language: "",
          proficiency: "",
          listening: "",
          speaking: "",
          reading: "",
          writing: "",
        },
      ],
    }))
  }

  const addTravelHistory = () => {
    setProfileData((prev) => ({
      ...prev,
      travelHistory: [
        ...prev.travelHistory,
        {
          country: "",
          purpose: "",
          startDate: "",
          endDate: "",
          visaCategory: "",
        },
      ],
    }))
  }

  const addReference = () => {
    setProfileData((prev) => ({
      ...prev,
      references: [
        ...prev.references,
        {
          name: "",
          organization: "",
          designation: "",
          relationship: "",
          yourPosition: "",
          phone: "",
          email: "",
        },
      ],
    }))
  }

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
              size="sm"
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </Button>
          )
        })}
      </div>

      {/* Needs & Preferences Section */}
      {activeSection === "preferences" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Needs & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Employment Status *</Label>
                <Select
                  value={profileData.employmentStatus}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, employmentStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Employment Type (Optional)</Label>
                <Select
                  value={profileData.preferredEmploymentType}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, preferredEmploymentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Preferred Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Countries you would like to process for? *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>My Preferred designation (Maximum 5) (Optional)</Label>
              <Input placeholder="Enter Preferred Designation" />
            </div>

            <div className="space-y-2">
              <Label>Preferred Industry (Maximum 3)</Label>
              <Input placeholder="Enter Preferred Industry" />
            </div>

            <div className="space-y-2">
              <Label>Key Skills (Maximum 5)</Label>
              <Input placeholder="Enter Key Skills" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="willing-travel"
                checked={profileData.willingToTravel}
                onCheckedChange={(checked) =>
                  setProfileData((prev) => ({ ...prev, willingToTravel: checked as boolean }))
                }
              />
              <Label htmlFor="willing-travel">I am willing to travel (Optional)</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Authorization Section */}
      {activeSection === "authorization" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Availability & Work Authorization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Do you have Work Authorization? (Optional)</Label>
              <Select
                value={profileData.hasWorkAuthorization}
                onValueChange={(value) => setProfileData((prev) => ({ ...prev, hasWorkAuthorization: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select authorization status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, I am authorized to work</SelectItem>
                  <SelectItem value="no">No, I don't have any Visa</SelectItem>
                  <SelectItem value="in-process">Not yet, my visa is in process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Licenses & Certifications Section */}
      {activeSection === "licenses" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Licenses & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.licenses.map((license, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">License/Certificate {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLicenses = profileData.licenses.filter((_, i) => i !== index)
                      setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name of license/certificate *</Label>
                    <Input
                      value={license.name}
                      onChange={(e) => {
                        const newLicenses = [...profileData.licenses]
                        newLicenses[index].name = e.target.value
                        setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                      }}
                      placeholder="Ex: Microsoft Certificate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization *</Label>
                    <Input
                      value={license.issuingOrganization}
                      onChange={(e) => {
                        const newLicenses = [...profileData.licenses]
                        newLicenses[index].issuingOrganization = e.target.value
                        setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                      }}
                      placeholder="Ex: Microsoft"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Credential ID (Optional)</Label>
                    <Input
                      value={license.credentialId}
                      onChange={(e) => {
                        const newLicenses = [...profileData.licenses]
                        newLicenses[index].credentialId = e.target.value
                        setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                      }}
                      placeholder="Credential ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Credential URL (Optional)</Label>
                    <Input
                      value={license.credentialUrl}
                      onChange={(e) => {
                        const newLicenses = [...profileData.licenses]
                        newLicenses[index].credentialUrl = e.target.value
                        setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                      }}
                      placeholder="Credential URL link"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`no-expiry-${index}`}
                    checked={license.doesNotExpire}
                    onCheckedChange={(checked) => {
                      const newLicenses = [...profileData.licenses]
                      newLicenses[index].doesNotExpire = checked as boolean
                      setProfileData((prev) => ({ ...prev, licenses: newLicenses }))
                    }}
                  />
                  <Label htmlFor={`no-expiry-${index}`}>This credential does not expire</Label>
                </div>
              </div>
            ))}

            <Button onClick={addLicense} variant="outline" className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add License & Certification
            </Button>

            {/* Licensure Section */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Licensure</h3>
              <div className="space-y-2">
                <Label>Does your Occupation require Licensure? (Optional)</Label>
                <Select
                  value={profileData.requiresLicensure}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, requiresLicensure: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profileData.requiresLicensure === "yes" && (
                <>
                  <div className="space-y-2">
                    <Label>Name of License</Label>
                    <Input
                      value={profileData.licenseName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, licenseName: e.target.value }))}
                      placeholder="Enter Name of the License"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issuing Authority (Optional)</Label>
                      <Input
                        value={profileData.issuingAuthority}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, issuingAuthority: e.target.value }))}
                        placeholder="Enter the Issuing Authority"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>License Number (Optional)</Label>
                      <Input
                        value={profileData.licenseNumber}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                        placeholder="Enter License Number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry date of the License</Label>
                    <Input
                      type="date"
                      value={profileData.licenseExpiryDate}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, licenseExpiryDate: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages & Global Exposure Section */}
      {activeSection === "languages" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Languages, Culture & Global Exposure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Languages</h3>
              {profileData.languages.map((lang, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Language {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLanguages = profileData.languages.filter((_, i) => i !== index)
                        setProfileData((prev) => ({ ...prev, languages: newLanguages }))
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language *</Label>
                      <Select
                        value={lang.language}
                        onValueChange={(value) => {
                          const newLanguages = [...profileData.languages]
                          newLanguages[index].language = value
                          setProfileData((prev) => ({ ...prev, languages: newLanguages }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Overall Proficiency (Optional)</Label>
                      <Select
                        value={lang.proficiency}
                        onValueChange={(value) => {
                          const newLanguages = [...profileData.languages]
                          newLanguages[index].proficiency = value
                          setProfileData((prev) => ({ ...prev, languages: newLanguages }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="native">Native</SelectItem>
                          <SelectItem value="fluent">Fluent</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="basic">Basic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addLanguage} variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </div>

            {/* Travel History */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Travel History</h3>
              {profileData.travelHistory.map((travel, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Travel {index + 1}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTravel = profileData.travelHistory.filter((_, i) => i !== index)
                        setProfileData((prev) => ({ ...prev, travelHistory: newTravel }))
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country visited *</Label>
                      <Select
                        value={travel.country}
                        onValueChange={(value) => {
                          const newTravel = [...profileData.travelHistory]
                          newTravel[index].country = value
                          setProfileData((prev) => ({ ...prev, travelHistory: newTravel }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Purpose of visit *</Label>
                      <Select
                        value={travel.purpose}
                        onValueChange={(value) => {
                          const newTravel = [...profileData.travelHistory]
                          newTravel[index].purpose = value
                          setProfileData((prev) => ({ ...prev, travelHistory: newTravel }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Please select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tourism">Tourism</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="family">Family Visit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={addTravelHistory} variant="outline" className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Travel History
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* References Section */}
      {activeSection === "references" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              References
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileData.references.map((ref, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Reference {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newReferences = profileData.references.filter((_, i) => i !== index)
                      setProfileData((prev) => ({ ...prev, references: newReferences }))
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name of Reference *</Label>
                    <Input
                      value={ref.name}
                      onChange={(e) => {
                        const newReferences = [...profileData.references]
                        newReferences[index].name = e.target.value
                        setProfileData((prev) => ({ ...prev, references: newReferences }))
                      }}
                      placeholder="What is the name of Reference ?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization *</Label>
                    <Input
                      value={ref.organization}
                      onChange={(e) => {
                        const newReferences = [...profileData.references]
                        newReferences[index].organization = e.target.value
                        setProfileData((prev) => ({ ...prev, references: newReferences }))
                      }}
                      placeholder="Ex: Google"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Designation *</Label>
                    <Input
                      value={ref.designation}
                      onChange={(e) => {
                        const newReferences = [...profileData.references]
                        newReferences[index].designation = e.target.value
                        setProfileData((prev) => ({ ...prev, references: newReferences }))
                      }}
                      placeholder="Ex: Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Position at that time *</Label>
                    <Input
                      value={ref.yourPosition}
                      onChange={(e) => {
                        const newReferences = [...profileData.references]
                        newReferences[index].yourPosition = e.target.value
                        setProfileData((prev) => ({ ...prev, references: newReferences }))
                      }}
                      placeholder="Ex: Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
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
                        value={ref.phone}
                        onChange={(e) => {
                          const newReferences = [...profileData.references]
                          newReferences[index].phone = e.target.value
                          setProfileData((prev) => ({ ...prev, references: newReferences }))
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      value={ref.email}
                      onChange={(e) => {
                        const newReferences = [...profileData.references]
                        newReferences[index].email = e.target.value
                        setProfileData((prev) => ({ ...prev, references: newReferences }))
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addReference} variant="outline" className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Reference
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sponsor Details Section */}
      {activeSection === "sponsor" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Sponsor Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sponsor's Country of Residence *</Label>
                <Select
                  value={profileData.sponsorDetails.country}
                  onValueChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, country: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select name of the country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name of Visa *</Label>
                <Select
                  value={profileData.sponsorDetails.visaName}
                  onValueChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, visaName: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Visa Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family-class">Family Class</SelectItem>
                    <SelectItem value="spouse-visa">Spouse Visa</SelectItem>
                    <SelectItem value="parent-visa">Parent Visa</SelectItem>
                    <SelectItem value="work-visa">Work Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name of the Sponsor (Optional)</Label>
                <Input
                  value={profileData.sponsorDetails.sponsorName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, sponsorName: e.target.value },
                    }))
                  }
                  placeholder="Enter Sponsor Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Name of the contact person (Optional)</Label>
                <Input
                  value={profileData.sponsorDetails.contactPersonName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, contactPersonName: e.target.value },
                    }))
                  }
                  placeholder="Enter Contact Person Name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Designation (Optional)</Label>
                <Input
                  value={profileData.sponsorDetails.designation}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, designation: e.target.value },
                    }))
                  }
                  placeholder="Enter designation"
                />
              </div>
              <div className="space-y-2">
                <Label>Telephone *</Label>
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
                    value={profileData.sponsorDetails.telephone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        sponsorDetails: { ...prev.sponsorDetails, telephone: e.target.value },
                      }))
                    }
                    placeholder="Telephone Number"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={profileData.sponsorDetails.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, email: e.target.value },
                    }))
                  }
                  placeholder="Enter Email"
                />
              </div>
              <div className="space-y-2">
                <Label>Website (Optional)</Label>
                <Input
                  value={profileData.sponsorDetails.website}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      sponsorDetails: { ...prev.sponsorDetails, website: e.target.value },
                    }))
                  }
                  placeholder="Website URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Questions Section */}
      {activeSection === "assessment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Assessment Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>How old are you? *</Label>
                <Select
                  value={profileData.age}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, age: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-30">26-30</SelectItem>
                    <SelectItem value="31-35">31-35</SelectItem>
                    <SelectItem value="36-40">36-40</SelectItem>
                    <SelectItem value="41-45">41-45</SelectItem>
                    <SelectItem value="46+">46+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level of Study Interested in? *</Label>
                <Select
                  value={profileData.levelOfStudyInterested}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, levelOfStudyInterested: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelor's</SelectItem>
                    <SelectItem value="masters">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>What is your highest education qualification? *</Label>
                <Select
                  value={profileData.highestEducation}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, highestEducation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stream *</Label>
                <Input
                  value={profileData.stream}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, stream: e.target.value }))}
                  placeholder="Enter stream"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Specialization *</Label>
                <Input
                  value={profileData.specialization}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Enter specialization"
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage *</Label>
                <Input
                  value={profileData.percentage}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, percentage: e.target.value }))}
                  placeholder="Enter percentage"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget *</Label>
                <Select
                  value={profileData.budget}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, budget: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>What was your medium of education? *</Label>
                <Select
                  value={profileData.mediumOfEducation}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, mediumOfEducation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="regional">Regional Language</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>How many years have you been working for? *</Label>
                <Select
                  value={profileData.yearsOfWork}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, yearsOfWork: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>What are/were you working as? *</Label>
                <Input
                  value={profileData.workingAs}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, workingAs: e.target.value }))}
                  placeholder="Enter job role"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Where are you from? *</Label>
                <Select
                  value={profileData.currentLocation}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, currentLocation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
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
              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  value={profileData.state}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Applying for self or Additional Member? *</Label>
                <Select
                  value={profileData.applyingFor}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, applyingFor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>No. of Applicants? *</Label>
                <Select
                  value={profileData.numberOfApplicants}
                  onValueChange={(value) => setProfileData((prev) => ({ ...prev, numberOfApplicants: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5+">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline">Back to Section 1</Button>
        <Button onClick={() => onComplete(profileData)}>Continue to GIS Score</Button>
      </div>
    </div>
  )
}
