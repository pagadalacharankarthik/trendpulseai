import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const huggingFaceApiKey = Deno.env.get('HUGGINGFACE_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cleanText = (text: string): string => {
  // Remove non-UTF8 characters and clean the text
  return text
    .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .trim();
};

const summarizeText = async (text: string): Promise<string> => {
  if (!huggingFaceApiKey) {
    // Fallback: simple text truncation if no API key
    console.log('No Hugging Face API key, using fallback summarization');
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('.') + '.';
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: 150,
            min_length: 30,
            do_sample: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result[0]?.summary_text) {
      return cleanText(result[0].summary_text);
    }
    
    throw new Error('Invalid response format from Hugging Face API');
  } catch (error) {
    console.error('Hugging Face API error:', error);
    // Fallback summarization
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('.') + '.';
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('N8N summarization webhook called');
    
    const body = await req.json();
    console.log('Request body:', body);

    const { text, user_id } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use a default user_id if not provided (for testing)
    const targetUserId = user_id || 'b0a9aeed-b8cd-4901-a458-eee2d3815dd6';

    console.log(`Processing text summarization for user: ${targetUserId}`);

    // Clean the input text
    const cleanedText = cleanText(text);
    console.log('Cleaned text:', cleanedText);

    // Generate summary using Hugging Face API
    const summary = await summarizeText(cleanedText);
    console.log('Generated summary:', summary);

    // Insert into Supabase summaries table
    const { data, error } = await supabase
      .from('summaries')
      .insert({
        user_id: targetUserId,
        summary: summary,
        original_text: cleanedText,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Summary inserted successfully:', data);

    return new Response(
      JSON.stringify({
        success: true,
        summary_id: data.id,
        summary: summary,
        original_text: cleanedText,
        user_id: targetUserId,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in n8n-summarize function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});