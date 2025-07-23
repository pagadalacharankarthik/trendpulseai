import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, FileText, Calendar, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Summary {
  id: string
  user_id: string
  summary: string
  original_text?: string
  created_at: string
  updated_at: string
}

export function SummariesDashboard() {
  const { user } = useAuth()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSummaries = async () => {
    try {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSummaries(data || [])
    } catch (error) {
      console.error('Error fetching summaries:', error)
      toast.error('Failed to load summaries')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSummaries()
    toast.success('Summaries refreshed!')
  }

  useEffect(() => {
    fetchSummaries()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getUserDisplay = (userId: string) => {
    if (user?.id === userId) return "You"
    return userId.slice(0, 8) + "..."
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Text Summaries
            </CardTitle>
            <CardDescription>
              AI-generated summaries processed through n8n workflow
            </CardDescription>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="whitespace-nowrap"
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No summaries yet</p>
            <p className="text-sm">
              Send text to your n8n workflow to see summaries here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {getUserDisplay(summary.user_id)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(summary.created_at)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Summary:</div>
                  <p className="text-foreground leading-relaxed">{summary.summary}</p>
                </div>
                
                {summary.original_text && (
                  <details className="mt-3">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                      View original text
                    </summary>
                    <div className="mt-2 p-3 bg-muted/30 rounded border-l-2 border-primary/20">
                      <p className="text-sm text-muted-foreground italic">{summary.original_text}</p>
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
        
        {summaries.length > 0 && (
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {summaries.length} summaries • Last updated: {formatDate(new Date().toISOString())}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}