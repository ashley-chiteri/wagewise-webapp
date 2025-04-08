'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type OnboardingData = {
  business_name: string;
  business_type: string;
  kra_pin: string;
  currency: string;
  address: string;
  county: string;
  sub_county: string;
  phone: string;
  email: string;
  admin_name?: string;
  admin_email?: string;
  role?: string;
  payroll_start_date?: string;
  payroll_frequency?: string;
  work_days?: string;
  kra_certificate_url?: string;
  nhif_code?: string;
  nssf_code?: string;
  nhif_cert_url?: string;
  nssf_cert_url?: string;
};

export default function ConfirmationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('User not logged in.');
        return;
      }

      const { data, error } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        toast.error('Error fetching data');
        return;
      }

      setData(data);
    }

    fetchData();
  }, []);

  const handleConfirm = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error('User not found');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('onboarding_profiles')
      .update({ onboarding_status: 'complete', step: 'done' })
      .eq('id', user.id);

    if (error) {
      toast.error('Could not complete onboarding.');
      setLoading(false);
      return;
    }

    toast.success('Onboarding complete!');
    router.push('/dashboard');
  };

  if (!data) return <p>Loading data...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Step 5: Confirm Your Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h4 className="font-semibold mb-2">🏢 Business Info</h4>
          <p><strong>Name:</strong> {data.business_name}</p>
          <p><strong>Type:</strong> {data.business_type}</p>
          <p><strong>KRA PIN:</strong> {data.kra_pin}</p>
          <p><strong>Currency:</strong> {data.currency}</p>
          <p><strong>Address:</strong> {data.address}, {data.sub_county}, {data.county}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
          <p><strong>Email:</strong> {data.email}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">👤 Admin Contact</h4>
          <p><strong>Name:</strong> {data.admin_name}</p>
          <p><strong>Email:</strong> {data.admin_email}</p>
          <p><strong>Role:</strong> {data.role}</p>

          <h4 className="font-semibold mt-4 mb-2">💼 Payroll</h4>
          <p><strong>Start Date:</strong> {data.payroll_start_date}</p>
          <p><strong>Frequency:</strong> {data.payroll_frequency}</p>
          <p><strong>Work Days:</strong> {data.work_days}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">🧾 Compliance</h4>
          <p><strong>NHIF Code:</strong> {data.nhif_code}</p>
          <p><strong>NSSF Code:</strong> {data.nssf_code}</p>
          {data.kra_certificate_url && (
            <p><a href={data.kra_certificate_url} className="text-blue-500 underline" target="_blank">View KRA Certificate</a></p>
          )}
          {data.nhif_cert_url && (
            <p><a href={data.nhif_cert_url} className="text-blue-500 underline" target="_blank">View NHIF Cert</a></p>
          )}
          {data.nssf_cert_url && (
            <p><a href={data.nssf_cert_url} className="text-blue-500 underline" target="_blank">View NSSF Cert</a></p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => router.push('/onboarding/steps/compliance')}>
          Go Back
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Confirm & Finish'}
        </Button>
      </div>
    </div>
  );
}
