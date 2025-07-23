import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ProfileSetupProps {
  onComplete: () => void;
  existingProfile?: any;
}

export const ProfileSetup = ({ onComplete, existingProfile }: ProfileSetupProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: existingProfile?.company_name || '',
    brand_industry: existingProfile?.brand_industry || '',
    brand_description: existingProfile?.brand_description || '',
    website_url: existingProfile?.website_url || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      toast.success('Profile updated successfully!');
      onComplete();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = formData.company_name && formData.brand_industry;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Brand Profile</CardTitle>
        <CardDescription>
          Please provide your company details to generate personalized AI reports and competitor insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="e.g., Nike, US Polo, Zara"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand_industry">Industry *</Label>
            <Input
              id="brand_industry"
              value={formData.brand_industry}
              onChange={(e) => setFormData(prev => ({ ...prev, brand_industry: e.target.value }))}
              placeholder="e.g., Fashion, Sportswear, Technology, Food"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand_description">Brand Description</Label>
            <Textarea
              id="brand_description"
              value={formData.brand_description}
              onChange={(e) => setFormData(prev => ({ ...prev, brand_description: e.target.value }))}
              placeholder="Brief description of your brand and what makes it unique..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              placeholder="https://your-website.com"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isComplete || loading}
          >
            {loading ? 'Updating...' : 'Save Profile & Generate Reports'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};