import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export function N8NSummarizeTester() {
  const { user } = useAuth()
  const [text, setText] = useState("")
  const [customUserId, setCustomUserId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      toast.error('Please enter some text to summarize')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Call our n8n edge function
      const response = await fetch('https://cuopwmeqxcglxacmdtgi.supabase.co/functions/v1/n8n-summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          user_id: customUserId || user?.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process text')
      }

      const result = await response.json()
      
      toast.success('Text summarized successfully!')
      setText("")
      setCustomUserId("")
      
      console.log('Summarization result:', result)
      
    } catch (error) {
      console.error('Error submitting text:', error)
      toast.error(`Failed to summarize text: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="text-xl">N8N Text Summarizer Tester</CardTitle>
        <CardDescription>
          Test the n8n workflow by submitting text for AI summarization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text to Summarize</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to summarize..."
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId">Custom User ID (optional)</Label>
            <Input
              id="userId"
              value={customUserId}
              onChange={(e) => setCustomUserId(e.target.value)}
              placeholder="Leave empty to use your current user ID"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Current user ID: {user?.id || 'Not logged in'}
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !text.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to N8N Workflow
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">How it works:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Text is sent to the n8n-summarize edge function</li>
            <li>Edge function calls Hugging Face API for summarization</li>
            <li>Summary is cleaned and stored in Supabase summaries table</li>
            <li>Result appears in the summaries dashboard above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}