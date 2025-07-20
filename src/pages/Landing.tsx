import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Bot
} from "lucide-react"
import { Link } from "react-router-dom"

export default function Landing() {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning algorithms analyze millions of data points to uncover hidden trends and opportunities."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-Time Monitoring",
      description: "Stay ahead with live tracking of trending topics, viral content, and emerging influencer movements."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Competitive Analysis",
      description: "Track competitor strategies, campaign performance, and market positioning with precision."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Actionable Reports",
      description: "Transform complex data into clear, actionable recommendations that drive results."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Influencer Discovery",
      description: "Find the perfect influencers for your brand with our intelligent matching system."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Alerts",
      description: "Get notified immediately when opportunities arise or trends shift in your industry."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "Fashion Forward",
      content: "TrendPulse AI helped us identify emerging trends 3 weeks before our competitors. Our campaign performance improved by 300%.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Brand Manager",
      company: "TechNova",
      content: "The influencer recommendations are spot-on. We've built authentic partnerships that drive real engagement.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Social Media Lead",
      company: "GreenEarth Co",
      content: "The real-time monitoring saved us from a potential PR crisis. Invaluable tool for any modern brand.",
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small brands and startups",
      features: [
        "10 trend reports per month",
        "Basic influencer discovery",
        "Email alerts",
        "7-day trend history",
        "Standard support"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing marketing teams",
      features: [
        "Unlimited trend reports",
        "Advanced influencer analytics",
        "Real-time alerts",
        "30-day trend history",
        "Competitive analysis",
        "Priority support",
        "Custom dashboards"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Built for large organizations",
      features: [
        "Everything in Professional",
        "Custom AI models",
        "API access",
        "Dedicated account manager",
        "Advanced integrations",
        "White-label options",
        "SLA guarantee"
      ],
      recommended: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Predict Trends.
                </span>
                <br />
                <span className="text-foreground">Dominate Markets.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Harness the power of AI to discover emerging trends, identify top influencers, 
                and make data-driven decisions that put your brand ahead of the competition.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" variant="hero" className="text-lg px-8 py-6 animate-pulse-glow">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Powerful Features for Modern Brands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to stay ahead of trends and make informed marketing decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-hover transition-all duration-300 border-0 bg-gradient-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Trusted by Leading Brands
            </h2>
            <p className="text-xl text-muted-foreground">
              See how companies are transforming their marketing with TrendPulse AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-card border-0">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-base mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.recommended ? 'ring-2 ring-primary shadow-hover' : ''} bg-gradient-card border-0`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">
                      {plan.price}
                      <span className="text-lg text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.recommended ? "hero" : "outline"}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of brands already using TrendPulse AI to stay ahead of the curve.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                Start Your Free Trial Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">
                TrendPulse AI
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 TrendPulse AI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}