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
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const formSchema = z.object({
  kra_pin: z.string().min(11, 'Enter valid KRA PIN'),
  nhif_code: z.string().optional(),
  nssf_code: z.string().optional(),
  cert_of_incorp: z.any().optional(),
  nhif_cert: z.any().optional(),
  nssf_cert: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ComplianceStep() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('compliance').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });
    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('User not found');
      setLoading(false);
      return;
    }

    try {
      const filePaths: Partial<FormData> = {};

      if (data.cert_of_incorp instanceof File) {
        filePaths.cert_of_incorp = await uploadFile(data.cert_of_incorp, `${user.id}/cert_of_incorp`);
      }
      if (data.nhif_cert instanceof File) {
        filePaths.nhif_cert = await uploadFile(data.nhif_cert, `${user.id}/nhif_cert`);
      }
      if (data.nssf_cert instanceof File) {
        filePaths.nssf_cert = await uploadFile(data.nssf_cert, `${user.id}/nssf_cert`);
      }

      const { error } = await supabase.from('onboarding_profiles').update({
        kra_pin: data.kra_pin,
        nhif_code: data.nhif_code,
        nssf_code: data.nssf_code,
        ...filePaths,
        step: 'compliance',
      }).eq('id', user.id);

      if (error) throw error;

      toast.success('Compliance details saved!');
      router.push('/onboarding/steps/confirm');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Step 4: Compliance Details</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>KRA PIN</Label>
          <Input {...register('kra_pin')} placeholder="P051234567P" />
        </div>

        <div>
          <Label>NHIF Employer Code</Label>
          <Input {...register('nhif_code')} placeholder="Optional" />
        </div>

        <div>
          <Label>NSSF Employer Code</Label>
          <Input {...register('nssf_code')} placeholder="Optional" />
        </div>

        <div>
          <Label>Certificate of Incorporation (PDF)</Label>
          <Input type="file" accept="application/pdf,image/*" {...register('cert_of_incorp')} />
        </div>

        <div>
          <Label>NHIF Compliance Certificate</Label>
          <Input type="file" accept="application/pdf,image/*" {...register('nhif_cert')} />
        </div>

        <div>
          <Label>NSSF Compliance Certificate</Label>
          <Input type="file" accept="application/pdf,image/*" {...register('nssf_cert')} />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Save & Continue'}
        </Button>
      </form>
    </div>
  );
}
