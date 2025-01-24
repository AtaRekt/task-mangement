import { validateRequest } from "@/lib/validate-request";
import { redirect } from 'next/navigation';

export default async function Home() {
  const { user } = await validateRequest();
  
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}