import { Suspense } from 'react';
import { getChats } from '@/lib/actions';
import { ClientPage } from './client-page';
import LoadingSpinner from '@/components/LoadingSpinner';

export default async function Home() {
  // 서버에서 초기 데이터 fetch
  const initialChats = await getChats();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClientPage initialChats={initialChats} />
    </Suspense>
  );
}