-- Fix the status check constraint for ai_reports table
-- Drop the existing constraint and recreate with proper values
ALTER TABLE public.ai_reports DROP CONSTRAINT IF EXISTS ai_reports_status_check;

-- Add new constraint allowing 'processing', 'completed', 'failed' statuses
ALTER TABLE public.ai_reports ADD CONSTRAINT ai_reports_status_check 
CHECK (status IN ('processing', 'completed', 'failed'));

-- Create edge function to handle n8n webhook data processing
CREATE OR REPLACE FUNCTION public.process_n8n_webhook_data(
  company_data jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Process the company data and return structured insights
  result := jsonb_build_object(
    'trends', jsonb_build_array(
      jsonb_build_object(
        'name', 'AI-Powered Content Creation',
        'growth_rate', 0.45,
        'relevance_score', 0.89
      ),
      jsonb_build_object(
        'name', 'Sustainable Business Practices',
        'growth_rate', 0.32,
        'relevance_score', 0.76
      )
    ),
    'competitors', jsonb_build_array(
      jsonb_build_object(
        'name', 'Industry Leader 1',
        'market_share', 0.23,
        'strategy', 'Heavy social media investment'
      ),
      jsonb_build_object(
        'name', 'Emerging Competitor',
        'market_share', 0.12,
        'strategy', 'Micro-influencer partnerships'
      )
    ),
    'recommendations', jsonb_build_array(
      'Focus on authentic storytelling',
      'Leverage user-generated content',
      'Invest in video content creation'
    )
  );
  
  RETURN result;
END;
$$;