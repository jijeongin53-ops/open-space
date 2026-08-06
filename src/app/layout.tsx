import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE || '공개공지 찾아라',
  description: '부산진구 공개 공지 확인 및 이벤트 제안 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <div className="title">{metadata.title as string}</div>
          <nav>
            <a href="/" style={{ marginRight: '15px' }}>홈</a>
            <a href="/checklist" style={{ fontWeight: 'bold' }}>체크리스트 등록</a>
          </nav>
        </header>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
