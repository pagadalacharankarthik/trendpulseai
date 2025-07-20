import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  TrendingUp, 
  RefreshCw, 
  Clock, 
  Users, 
  BarChart3, 
  Target,
  LogOut,
  Bell,
  Settings,
  Download,
  Eye,
  Calendar,
  ExternalLink,
  Zap
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // Simulate API call to n8n webhook
    setTimeout(() => {
      setIsGenerating(false)
      setLastUpdate(new Date())
    }, 3000)
  }

  const mockInfluencerPosts = [
    {
      id: 1,
      influencer: "@fashionista_emma",
      platform: "Instagram",
      content: "Summer trends are shifting towards sustainable fashion...",
      engagement: "45.2K",
      sentiment: "Positive",
      trend_score: 92,
      posted_at: "2 hours ago"
    },
    {
      id: 2,
      influencer: "@tech_reviewer_max",
      platform: "TikTok", 
      content: "AI tools are becoming the new must-have for creators...",
      engagement: "128.7K",
      sentiment: "Very Positive",
      trend_score: 88,
      posted_at: "4 hours ago"
    },
    {
      id: 3,
      influencer: "@wellness_guru_sara",
      platform: "YouTube",
      content: "Mental health apps are seeing unprecedented growth...",
      engagement: "89.1K",
      sentiment: "Positive",
      trend_score: 85,
      posted_at: "6 hours ago"
    },
    {
      id: 4,
      influencer: "@foodie_adventures",
      platform: "Instagram",
      content: "Plant-based alternatives are dominating food trends...",
      engagement: "67.3K",
      sentiment: "Neutral",
      trend_score: 79,
      posted_at: "8 hours ago"
    }
  ]

  const mockReportHistory = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Weekly Trend Report",
      status: "Completed",
      insights: 127,
      trends: 23
    },
    {
      id: 2,
      date: "2024-01-08", 
      type: "Competitor Analysis",
      status: "Completed",
      insights: 89,
      trends: 18
    },
    {
      id: 3,
      date: "2024-01-01",
      type: "Influencer Report",
      status: "Completed", 
      insights: 156,
      trends: 31
    }
  ]

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Very Positive": return "bg-success/10 text-success border-success/20"
      case "Positive": return "bg-success/10 text-success border-success/20"
      case "Neutral": return "bg-warning/10 text-warning border-warning/20"
      case "Negative": return "bg-destructive/10 text-destructive border-destructive/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getTrendScoreColor = (score: number) => {
    if (score >= 90) return "text-success"
    if (score >= 80) return "text-warning"
    return "text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TrendPulse AI
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here's what's trending in your industry today.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trends</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">127</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Influencers Tracked</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">2,847</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">8.4%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">23</div>
                <p className="text-xs text-muted-foreground">
                  +8 new this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Report Section */}
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Latest AI Trend Report</CardTitle>
                  <CardDescription>
                    Generated on {lastUpdate.toLocaleDateString()} at {lastUpdate.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  variant="gradient"
                  className="whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate New Report
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-success rounded-full"></div>
                    <span className="text-sm font-medium">Report Status: Complete</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Next refresh in 6 hours</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Report Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-success">🔥 Top Trending</h4>
                  <p className="text-sm text-muted-foreground">
                    Sustainable fashion and AI-powered beauty tools are gaining massive traction. 
                    Engagement rates up 127% this week.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-warning">⚡ Competitor Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    Your main competitors are investing heavily in micro-influencer campaigns. 
                    Consider adapting your strategy.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">💡 Actionable Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Partner with eco-conscious influencers this quarter. 
                    Peak engagement window: 7-9 PM EST.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Influencer Posts */}
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Latest Influencer Posts</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Content Preview</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Trend Score</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInfluencerPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.influencer}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.platform}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                        <TableCell className="font-medium">{post.engagement}</TableCell>
                        <TableCell>
                          <Badge className={getSentimentColor(post.sentiment)}>
                            {post.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-bold ${getTrendScoreColor(post.trend_score)}`}>
                          {post.trend_score}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{post.posted_at}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Report History */}
          <Card className="bg-gradient-card border-0">
            <CardHeader>
              <CardTitle className="text-xl">Report History</CardTitle>
              <CardDescription>
                Your recent trend analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportHistory.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{report.date}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{report.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.insights} insights • {report.trends} trends identified
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-success border-success/20">
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}