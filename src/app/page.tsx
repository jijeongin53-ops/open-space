'use client';

import dynamic from 'next/dynamic';

const MainMap = dynamic(() => import('@/components/MainMap'), {
  ssr: false,
  loading: () => <div style={{ height: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도를 불러오는 중입니다...</div>
});

export default function Home() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MainMap />
    </div>
  );
}
