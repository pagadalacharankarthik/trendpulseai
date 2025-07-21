import { useState, useEffect } from "react"
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
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [reports, setReports] = useState<any[]>([])
  const [influencerPosts, setInfluencerPosts] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch AI reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (reportsError) throw reportsError
      
      // Fetch influencer posts
      const { data: postsData, error: postsError } = await supabase
        .from('influencer_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (postsError) throw postsError
      
      setReports(reportsData || [])
      setInfluencerPosts(postsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      // Create a new AI report
      const { data, error } = await supabase
        .from('ai_reports')
        .insert({
          user_id: user?.id,
          title: 'AI Trend Analysis',
          status: 'processing',
          report_data: {
            trends: [],
            insights: [],
            competitors: []
          }
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Simulate processing time
      setTimeout(async () => {
        // Update report with completed status
        const { error: updateError } = await supabase
          .from('ai_reports')
          .update({
            status: 'completed',
            summary: 'AI-generated trend analysis completed successfully',
            actionable_suggestions: ['Partner with eco-conscious influencers', 'Focus on 7-9 PM engagement window'],
            competitor_insights: ['Competitors investing in micro-influencer campaigns', 'Sustainable fashion trending']
          })
          .eq('id', data.id)
        
        if (!updateError) {
          fetchData()
          setLastUpdate(new Date())
          toast.success('Report generated successfully!')
        }
        setIsGenerating(false)
      }, 3000)
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
      setIsGenerating(false)
    }
  }

  const handleExportReport = async (reportId?: string) => {
    try {
      let query = supabase.from('ai_reports').select('*').eq('user_id', user?.id)
      
      if (reportId) {
        query = query.eq('id', reportId)
      }
      
      const { data, error } = await query
      if (error) throw error
      
      // Convert to CSV
      const csvContent = data.map(report => ({
        'Report ID': report.id,
        'Title': report.title,
        'Status': report.status,
        'Summary': report.summary || '',
        'Created': new Date(report.created_at).toLocaleDateString(),
        'Suggestions': report.actionable_suggestions?.join('; ') || '',
        'Insights': report.competitor_insights?.join('; ') || ''
      }))
      
      const csv = [
        Object.keys(csvContent[0]).join(','),
        ...csvContent.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `trendpulse-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  const handleViewAllPosts = () => {
    // Navigate to a detailed posts view (could be implemented later)
    toast.info('Detailed posts view coming soon!')
  }

  if (loading || loadingData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  }

  if (!user) {
    return null
  }

  // Use mock data if no real data available
  const displayInfluencerPosts = influencerPosts.length > 0 ? influencerPosts : [
    {
      id: 'mock1',
      influencer_name: "@fashionista_emma",
      platform: "Instagram",
      content: "Summer trends are shifting towards sustainable fashion...",
      engagement_rate: 0.452,
      reach: 45200,
      posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'mock2',
      influencer_name: "@tech_reviewer_max",
      platform: "TikTok", 
      content: "AI tools are becoming the new must-have for creators...",
      engagement_rate: 0.635,
      reach: 128700,
      posted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]

  const displayReports = reports.length > 0 ? reports : [
    {
      id: 'mock1',
      title: "Weekly Trend Report",
      status: "completed",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      summary: "AI-generated weekly analysis"
    },
    {
      id: 'mock2',
      title: "Competitor Analysis",
      status: "completed",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      summary: "Competitive landscape insights"
    }
  ]

  const getSentimentColor = (engagementRate: number) => {
    if (engagementRate >= 0.5) return "bg-success/10 text-success border-success/20"
    if (engagementRate >= 0.3) return "bg-warning/10 text-warning border-warning/20"
    return "bg-muted/10 text-muted-foreground border-muted/20"
  }

  const getSentimentLabel = (engagementRate: number) => {
    if (engagementRate >= 0.5) return "High"
    if (engagementRate >= 0.3) return "Medium"
    return "Low"
  }

  const formatEngagement = (rate: number, reach: number) => {
    if (reach) return `${(reach / 1000).toFixed(1)}K`
    return `${(rate * 100).toFixed(1)}%`
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
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={signOut}>
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
                <Button variant="outline" size="sm" onClick={() => handleExportReport()}>
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
                <Button variant="outline" size="sm" onClick={handleViewAllPosts}>
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
                    {displayInfluencerPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.influencer_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.platform}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                        <TableCell className="font-medium">
                          {formatEngagement(post.engagement_rate || 0, post.reach || 0)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSentimentColor(post.engagement_rate || 0)}>
                            {getSentimentLabel(post.engagement_rate || 0)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          {post.engagement_rate ? `${(post.engagement_rate * 100).toFixed(1)}%` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {post.posted_at ? new Date(post.posted_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => post.post_url && window.open(post.post_url, '_blank')}>
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
                {displayReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.summary || 'AI-generated trend analysis'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-success border-success/20 capitalize">
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => toast.info('Detailed view coming soon!')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleExportReport(report.id)}>
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