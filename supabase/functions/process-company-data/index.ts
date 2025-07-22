import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, company_name, brand_industry, brand_description, website_url, n8n_data } = await req.json();

    console.log('Processing company data for user:', user_id);
    console.log('Company info:', { company_name, brand_industry, website_url });

    // Simulate data processing and enrichment from n8n
    const enrichedData = {
      trends: [
        {
          name: 'AI-Powered Content Creation',
          growth_rate: 0.45,
          relevance_score: 0.89,
          industry_specific: brand_industry?.toLowerCase().includes('tech') || brand_industry?.toLowerCase().includes('ai')
        },
        {
          name: 'Sustainable Business Practices',
          growth_rate: 0.32,
          relevance_score: brand_industry?.toLowerCase().includes('fashion') || brand_industry?.toLowerCase().includes('environment') ? 0.95 : 0.76,
          industry_specific: true
        },
        {
          name: 'Video-First Marketing',
          growth_rate: 0.58,
          relevance_score: 0.84,
          industry_specific: false
        }
      ],
      competitors: [
        {
          company_name: `${brand_industry} Market Leader`,
          market_share: 0.23,
          strategy: 'Heavy social media investment',
          strengths: ['Brand recognition', 'Large budget', 'Wide reach'],
          weaknesses: ['Less authentic engagement', 'Generic content']
        },
        {
          company_name: 'Emerging Digital Competitor',
          market_share: 0.12,
          strategy: 'Micro-influencer partnerships',
          strengths: ['Authentic content', 'High engagement rates', 'Niche targeting'],
          weaknesses: ['Limited reach', 'Budget constraints']
        }
      ],
      insights: [
        `Companies in ${brand_industry || 'your industry'} are seeing 40% higher engagement with authentic storytelling`,
        'Peak engagement times are 7-9 PM EST across all platforms',
        'User-generated content drives 3x more engagement than brand-created content',
        'Video content performs 60% better than static images'
      ],
      recommendations: [
        `Partner with ${brand_industry || 'industry'}-specific micro-influencers`,
        'Focus on authentic storytelling over product promotion',
        'Leverage user-generated content campaigns',
        'Invest in short-form video content creation',
        'Implement sustainability messaging if relevant to brand values'
      ]
    };

    // Insert competitor data into competitors table
    for (const competitor of enrichedData.competitors) {
      await supabaseClient
        .from('competitors')
        .upsert({
          user_id,
          company_name: competitor.company_name,
          industry: brand_industry,
          market_position: `${(competitor.market_share * 100).toFixed(1)}% market share`,
          description: competitor.strategy,
          key_metrics: {
            strengths: competitor.strengths,
            weaknesses: competitor.weaknesses,
            market_share: competitor.market_share
          }
        }, {
          onConflict: 'user_id,company_name'
        });
    }

    // Generate sample influencer posts
    const samplePosts = [
      {
        user_id,
        influencer_name: '@tech_trendsetter',
        platform: 'Instagram',
        content: `Just discovered this amazing ${brand_industry || 'tech'} company! Their approach to innovation is incredible. #Innovation #${brand_industry?.replace(/\s+/g, '') || 'Tech'}`,
        engagement_rate: 0.067,
        reach: 45600,
        posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id,
        influencer_name: '@lifestyle_maven',
        platform: 'TikTok',
        content: `This is how forward-thinking companies in ${brand_industry || 'the industry'} are changing the game! 🚀`,
        engagement_rate: 0.089,
        reach: 78300,
        posted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        user_id,
        influencer_name: '@business_insider_pro',
        platform: 'LinkedIn',
        content: `Analyzing the latest trends in ${brand_industry || 'business'} - companies like ${company_name || 'innovative startups'} are leading the charge`,
        engagement_rate: 0.034,
        reach: 23400,
        posted_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert influencer posts
    for (const post of samplePosts) {
      await supabaseClient
        .from('influencer_posts')
        .insert(post);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Company data processed successfully',
        data: enrichedData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error processing company data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});