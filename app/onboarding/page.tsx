// app/onboarding/page.tsx
import { redirect } from 'next/navigation';

export default function OnboardingIndex() {
  // You can add logic here to check the user's progress (e.g., from Supabase metadata)
  redirect('/onboarding/steps/business-profile');
}
