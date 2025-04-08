'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const adminSchema = z.object({
  admin_name: z.string().min(2, 'Name is required'),
  admin_email: z.string().email('Invalid email'),
  admin_phone: z.string().min(7, 'Enter a valid phone number'),
  admin_role: z.enum(['Owner', 'HR', 'Other']),
  admin_notes: z.string().optional(),
});

type AdminData = z.infer<typeof adminSchema>;

export default function BusinessAdminStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AdminData>({
    resolver: zodResolver(adminSchema),
  });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setValue('admin_email', user.email);
      }
    }

    getUser();
  }, [setValue]);

  const onSubmit = async (data: AdminData) => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('onboarding_profiles').upsert({
      id: user.id,
      ...data,
      step: 'business_admin',
      onboarding_status: 'started',
    });

    if (error) {
      toast.error('Failed to save admin info: ' + error.message);
      setLoading(false);
      return;
    }

    toast.success('Admin contact saved!');
    setLoading(false);
    router.push('/onboarding/steps/payroll-setup'); // Adjust to next step
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Step 2: Business Admin Contact</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input placeholder="Jane Doe" {...register('admin_name')} />
          {errors.admin_name && <p className="text-sm text-red-500">{errors.admin_name.message}</p>}
        </div>

        <div>
          <Label>Email</Label>
          <Input placeholder="admin@company.com" {...register('admin_email')} disabled />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input placeholder="0712345678" {...register('admin_phone')} />
        </div>

        <div>
          <Label>Role</Label>
          <select {...register('admin_role')} className="w-full border border-gray-300 rounded-md p-2">
            <option value="">Select Role</option>
            <option value="Owner">Owner</option>
            <option value="HR">HR</option>
            <option value="Other">Other</option>
          </select>
          {errors.admin_role && <p className="text-sm text-red-500">{errors.admin_role.message}</p>}
        </div>

        <div>
          <Label>Notes (Optional)</Label>
          <Textarea placeholder="Any notes about this contact..." {...register('admin_notes')} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Continue'}
        </Button>
      </form>
    </div>
  );
}
