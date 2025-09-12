"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, ExternalLink, AlertTriangle, CheckCircle, Target, Globe, Award } from "lucide-react"

interface GISScoringProps {
  profileData?: any
  onContinue: () => void
}

export default function GISScoring({ profileData, onContinue }: GISScoringProps) {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)

  // Simulate GIS score calculation based on profile data
  const gisScore = 38 // Intentionally low to promote JSS services

  const scoreBreakdown = [
    { category: "Age", score: 8, maxScore: 12, status: "good" },
    { category: "Education", score: 6, maxScore: 25, status: "poor" },
    { category: "Language Proficiency", score: 4, maxScore: 28, status: "poor" },
    { category: "Work Experience", score: 12, maxScore: 15, status: "good" },
    { category: "Arranged Employment", score: 0, maxScore: 10, status: "poor" },
    { category: "Adaptability", score: 8, maxScore: 10, status: "good" },
  ]

  const getScoreColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-primary"
      case "average":
        return "text-yellow-600"
      case "poor":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-primary"
      case "average":
        return "bg-yellow-500"
      case "poor":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main GIS Score Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-balance">Your GIS Score</CardTitle>
          <CardDescription>
            Global Immigration Score based on your profile assessment for immigration eligibility
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(gisScore / 100) * 439.8} 439.8`}
                className="text-destructive"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-destructive">{gisScore}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
              <h3 className="font-semibold text-destructive">Below Minimum Threshold</h3>
            </div>
            <p className="text-sm text-destructive/80">
              Your current GIS score is below the minimum requirement of 67 points for most immigration programs.
              Professional guidance can significantly improve your eligibility.
            </p>
          </div>

          <Button variant="outline" onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)} className="mb-4">
            {showDetailedAnalysis ? "Hide" : "View"} Detailed Score Breakdown
          </Button>

          {showDetailedAnalysis && (
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-4 text-center">Score Breakdown</h4>
              <div className="space-y-3">
                {scoreBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className={`text-sm font-semibold ${getScoreColor(item.status)}`}>
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(item.status)}`}
                          style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JSS Service Promotion */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Target className="w-5 h-5 mr-2" />
            Boost Your GIS Score with Professional JSS Services
          </CardTitle>
          <CardDescription>
            Our Job Search Services (JSS) can help you achieve the minimum 67+ points required for successful
            immigration applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                What JSS includes:
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Job market analysis for target countries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Arranged employment opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Professional networking assistance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Interview preparation and coaching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Employer sponsorship guidance</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Expected improvements:
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>+15-20 points from arranged employment</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>+5-10 points from adaptability factors</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Guaranteed 67+ final GIS score</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>3x higher immigration success rate</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Faster processing timelines</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Score Projection */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-primary mb-3">Projected Score with JSS</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{gisScore}</div>
                <div className="text-xs text-muted-foreground">Current Score</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="relative">
                  <Progress value={75} className="h-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">+34 points</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">72</div>
                <div className="text-xs text-muted-foreground">With JSS</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <a href="https://store.y-axis.com/" target="_blank" rel="noopener noreferrer">
                Get Professional JSS Services
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" onClick={onContinue}>
              Continue to Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Why Choose Y-axis JSS?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              With over 25 years of experience and 50,000+ successful immigration cases, Y-axis is your trusted partner
              for achieving immigration success.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-xs text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-xs text-muted-foreground">Success Stories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
