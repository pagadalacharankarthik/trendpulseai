import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Eye, Calendar, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<any[]>([])
  const [influencerPosts, setInfluencerPosts] = useState<any[]>([])
  const [competitors, setCompetitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAllData()
    }
  }, [user])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (reportsError) throw reportsError
      
      // Fetch all influencer posts
      const { data: postsData, error: postsError } = await supabase
        .from('influencer_posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (postsError) throw postsError
      
      // Fetch all competitors
      const { data: competitorsData, error: competitorsError } = await supabase
        .from('competitors')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
      
      if (competitorsError) throw competitorsError
      
      setReports(reportsData || [])
      setInfluencerPosts(postsData || [])
      setCompetitors(competitorsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (reportId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('id', reportId)
        .single()
      
      if (error) throw error
      
      // Convert to JSON and download
      const reportContent = {
        'Report ID': data.id,
        'Title': data.title,
        'Status': data.status,
        'Summary': data.summary || '',
        'Created': new Date(data.created_at).toLocaleDateString(),
        'Suggestions': data.actionable_suggestions || [],
        'Insights': data.competitor_insights || [],
        'Report Data': data.report_data || {}
      }
      
      const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${data.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully!')
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Detailed Reports & Data</h1>
              <p className="text-muted-foreground">
                View all your reports, influencer posts, and competitor insights
              </p>
            </div>
          </div>

          {/* AI Reports */}
          <Card>
            <CardHeader>
              <CardTitle>AI Reports ({reports.length})</CardTitle>
              <CardDescription>
                Comprehensive trend analysis reports generated for your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {report.summary || 'No summary available'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleExportReport(report.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reports generated yet. Go back to dashboard to generate your first report.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Influencer Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Influencer Posts ({influencerPosts.length})</CardTitle>
              <CardDescription>
                Recent posts from tracked influencers relevant to your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {influencerPosts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Reach</TableHead>
                      <TableHead>Posted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencerPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.influencer_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{post.platform}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{post.content}</TableCell>
                        <TableCell>
                          {post.engagement_rate ? `${(post.engagement_rate * 100).toFixed(1)}%` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {post.reach ? `${(post.reach / 1000).toFixed(1)}K` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {post.posted_at ? new Date(post.posted_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No influencer posts tracked yet. Generate a report to start tracking relevant posts.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card>
            <CardHeader>
              <CardTitle>Competitors ({competitors.length})</CardTitle>
              <CardDescription>
                Identified competitors and their market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {competitors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Market Position</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Website</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitors.map((competitor) => (
                      <TableRow key={competitor.id}>
                        <TableCell className="font-medium">{competitor.company_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{competitor.industry}</Badge>
                        </TableCell>
                        <TableCell>{competitor.market_position || 'N/A'}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {competitor.description || 'No description available'}
                        </TableCell>
                        <TableCell>
                          {competitor.website_url ? (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={competitor.website_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No competitors identified yet. Generate a report to analyze your competitive landscape.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}