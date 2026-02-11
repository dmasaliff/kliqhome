import { SuccessContent } from '@/components/SuccessContent';
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export default function PekerjaanSelesai() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}