'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';

const formSchema = z.object({
  payroll_start_date: z.string().min(1, 'Required'),
  payroll_frequency: z.string().min(1, 'Required'),
  working_days: z.array(z.string()).min(1, 'Select at least one working day'),
  work_hours: z.string().min(1, 'Required'),
  pay_structure: z.string(),
  nssf_scheme: z.string(),
  nhif_rate_option: z.string(),
  has_pension: z.boolean(),
  pension_percent: z.union([z.string(), z.number()]).optional(),
  allow_overtime: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function BusinessSettingsStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      working_days: [],
      has_pension: false,
      allow_overtime: false
    }
  });

  const hasPension = watch('has_pension');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('User not found');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('onboarding_profiles').update({
      ...data,
      step: 'business_settings',
    }).eq('id', user.id);

    if (error) {
      toast.error('Failed to save settings: ' + error.message);
      setLoading(false);
      return;
    }

    toast.success('Business settings saved!');
    setLoading(false);
    router.push('/onboarding/steps/compliance');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Step 3: Business Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <Label>Payroll Start Date</Label>
          <Input type="date" {...register('payroll_start_date')} />
        </div>

        <div>
          <Label>Payroll Frequency</Label>
          <Select onValueChange={(val) => setValue('payroll_frequency', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Biweekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Default Working Days</Label>
          <ToggleGroup
            type="multiple"
            onValueChange={(val) => setValue('working_days', val)}
            className="flex gap-2 flex-wrap"
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <ToggleGroupItem key={day} value={day}>{day}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <Label>Default Work Hours</Label>
          <Input placeholder="e.g. 8AM–5PM" {...register('work_hours')} />
        </div>

        <div>
          <Label>Pay Structure</Label>
          <Select onValueChange={(val) => setValue('pay_structure', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Gross → Net or Net → Gross" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gross_to_net">Gross → Net</SelectItem>
              <SelectItem value="net_to_gross">Net → Gross</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>NSSF Scheme Type</Label>
          <Select onValueChange={(val) => setValue('nssf_scheme', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tier1">Tier I</SelectItem>
              <SelectItem value="tier1_2">Tier I & II</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>NHIF Rate Option</Label>
          <ToggleGroup
            type="single"
            onValueChange={(val) => setValue('nhif_rate_option', val)}
            className="flex gap-2"
          >
            <ToggleGroupItem value="slab">Slab-based</ToggleGroupItem>
            <ToggleGroupItem value="fixed">Fixed</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="has_pension" {...register('has_pension')} />
          <Label htmlFor="has_pension">Include Pension Scheme?</Label>
        </div>

        {hasPension && (
          <div>
            <Label>Contribution %</Label>
            <Input placeholder="e.g. 5" {...register('pension_percent')} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Checkbox id="allow_overtime" {...register('allow_overtime')} />
          <Label htmlFor="allow_overtime">Enable Overtime Rules?</Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Continue'}
        </Button>
      </form>
    </div>
  );
}
