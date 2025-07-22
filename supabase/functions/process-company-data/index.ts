import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getRelevantCompetitors(companyName: string, industry: string) {
  const normalizedCompany = companyName?.toLowerCase() || '';
  const normalizedIndustry = industry?.toLowerCase() || '';
  
  // Define competitor mappings based on brands and industries
  const competitorMappings = {
    // Sports/Athletic brands
    nike: ['Adidas', 'Puma', 'Under Armour', 'New Balance', 'Reebok'],
    adidas: ['Nike', 'Puma', 'Under Armour', 'New Balance', 'Reebok'],
    puma: ['Nike', 'Adidas', 'Under Armour', 'New Balance', 'Reebok'],
    
    // Fashion/Apparel brands
    'us polo': ['Ralph Lauren', 'Tommy Hilfiger', 'Lacoste', 'Burberry'],
    'polo ralph lauren': ['US Polo Assn', 'Tommy Hilfiger', 'Lacoste', 'Burberry'],
    'tommy hilfiger': ['Ralph Lauren', 'US Polo Assn', 'Lacoste', 'Calvin Klein'],
    zara: ['H&M', 'Uniqlo', 'Forever 21', 'Mango'],
    'h&m': ['Zara', 'Uniqlo', 'Forever 21', 'Mango'],
    
    // Indian fashion brands
    'rare rabbit': ['Snitch', 'The Souled Store', 'Bewakoof', 'Campus Sutra'],
    snitch: ['Rare Rabbit', 'The Souled Store', 'Bewakoof', 'Campus Sutra'],
    bewakoof: ['Snitch', 'Rare Rabbit', 'The Souled Store', 'Campus Sutra'],
    
    // Tech companies
    apple: ['Samsung', 'Google', 'Microsoft', 'Amazon'],
    google: ['Apple', 'Microsoft', 'Amazon', 'Meta'],
    microsoft: ['Apple', 'Google', 'Amazon', 'Oracle'],
    
    // Fast food
    mcdonald: ['Burger King', 'KFC', 'Subway', 'Pizza Hut'],
    'burger king': ['McDonald\'s', 'KFC', 'Subway', 'Pizza Hut'],
    kfc: ['McDonald\'s', 'Burger King', 'Subway', 'Pizza Hut'],
  };
  
  // Industry-based competitors
  const industryCompetitors = {
    fashion: ['Zara', 'H&M', 'Uniqlo', 'Forever 21'],
    apparel: ['Zara', 'H&M', 'Uniqlo', 'Forever 21'],
    clothing: ['Zara', 'H&M', 'Uniqlo', 'Forever 21'],
    sportswear: ['Nike', 'Adidas', 'Puma', 'Under Armour'],
    technology: ['Apple', 'Google', 'Microsoft', 'Amazon'],
    tech: ['Apple', 'Google', 'Microsoft', 'Amazon'],
    food: ['McDonald\'s', 'Burger King', 'KFC', 'Subway'],
    retail: ['Amazon', 'Walmart', 'Target', 'Best Buy'],
    automotive: ['Toyota', 'Ford', 'BMW', 'Mercedes-Benz'],
  };
  
  // Try to find specific brand competitors first
  let competitors = [];
  for (const [brand, comps] of Object.entries(competitorMappings)) {
    if (normalizedCompany.includes(brand)) {
      competitors = comps;
      break;
    }
  }
  
  // Fall back to industry-based competitors
  if (competitors.length === 0) {
    for (const [ind, comps] of Object.entries(industryCompetitors)) {
      if (normalizedIndustry.includes(ind)) {
        competitors = comps;
        break;
      }
    }
  }
  
  // Default competitors if nothing matches
  if (competitors.length === 0) {
    competitors = ['Market Leader A', 'Market Leader B', 'Emerging Competitor', 'Digital Disruptor'];
  }
  
  // Generate competitor objects with realistic data
  return competitors.slice(0, 4).map((name, index) => ({
    company_name: name,
    market_share: Math.random() * 0.3 + 0.05, // 5% to 35%
    strategy: [
      'Heavy social media investment',
      'Micro-influencer partnerships', 
      'Celebrity endorsements',
      'Content marketing focus',
      'E-commerce optimization'
    ][index % 5],
    strengths: [
      ['Brand recognition', 'Large budget', 'Wide reach'],
      ['Authentic content', 'High engagement', 'Niche targeting'],
      ['Innovation focus', 'Tech integration', 'User experience'],
      ['Price competitive', 'Fast delivery', 'Customer service']
    ][index % 4],
    weaknesses: [
      ['Less authentic engagement', 'Generic content'],
      ['Limited reach', 'Budget constraints'], 
      ['High costs', 'Complex messaging'],
      ['Quality concerns', 'Brand perception']
    ][index % 4]
  }));
}

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
      competitors: getRelevantCompetitors(company_name, brand_industry),
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