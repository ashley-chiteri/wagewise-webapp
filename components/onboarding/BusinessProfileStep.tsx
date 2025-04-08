'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const businessProfileSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  business_type: z.string().min(2, 'Business type is required'),
  industry: z.string().optional(),
  registration_number: z.string().optional(),
  kra_pin: z.string().min(3, 'KRA PIN is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().min(3, 'Address is required'),
  county: z.string().min(2, 'County is required'),
  sub_county: z.string().min(2, 'Sub-county is required'),
  currency: z.string().default('KES'),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export default function BusinessProfileStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      currency: 'KES'
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error('Unable to retrieve user information');
        return;
      }

      setValue('email', user.email ?? '');
    };

    fetchUser();
  }, [setValue]);

  const onSubmit = async (data: BusinessProfileFormData) => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error('User not authenticated');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('onboarding_profiles').upsert({
      id: user.id,
      ...data,
      step: 'business_profile',
      onboarding_status: 'started',
    });

    if (insertError) {
      toast.error('Failed to save business profile: ' + insertError.message);
    } else {
      toast.success('Business profile saved!');
      router.push('/onboarding/steps/business-admin');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Step 1: Business Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Business Name" error={errors.business_name?.message}>
          <Input placeholder="Acme Ltd" {...register('business_name')} />
        </FormField>

        <FormField label="Business Type" error={errors.business_type?.message}>
          <Input placeholder="Limited Company" {...register('business_type')} />
        </FormField>

        <FormField label="Industry / Sector">
          <Input placeholder="Retail, Services, etc." {...register('industry')} />
        </FormField>

        <FormField label="Registration Number">
          <Input placeholder="C123456" {...register('registration_number')} />
        </FormField>

        <FormField label="KRA PIN" error={errors.kra_pin?.message}>
          <Input placeholder="A123456789Z" {...register('kra_pin')} />
        </FormField>

        <FormField label="Email Address" error={errors.email?.message}>
          <Input placeholder="contact@yourcompany.com" {...register('email')} disabled />
        </FormField>

        <FormField label="Phone Number" error={errors.phone?.message}>
          <Input placeholder="0712345678" {...register('phone')} />
        </FormField>

        <FormField label="Physical Address" error={errors.address?.message}>
          <Textarea placeholder="e.g., 12 Moi Avenue, Nairobi" {...register('address')} />
        </FormField>

        <div className="flex gap-4">
          <div className="flex-1">
            <FormField label="County" error={errors.county?.message}>
              <Input placeholder="Nairobi" {...register('county')} />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="Sub-County" error={errors.sub_county?.message}>
              <Input placeholder="Westlands" {...register('sub_county')} />
            </FormField>
          </div>
        </div>

        <FormField label="Currency">
          <Input placeholder="KES" defaultValue="KES" {...register('currency')} />
        </FormField>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Continue'}
        </Button>
      </form>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
