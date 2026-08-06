import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
  if (!kakaoApiKey) {
    return NextResponse.json({ error: 'Kakao API key is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(q)}`, {
      headers: {
        'Authorization': `KakaoAK ${kakaoApiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kakao API returned ${response.status}`);
    }

    const data = await response.json();
    
    // 프론트엔드(Map.tsx)가 기대하는 포맷 [{ lat, lon }]으로 변환해서 반환합니다.
    if (data.documents && data.documents.length > 0) {
      const result = data.documents.map((doc: any) => ({
        lat: doc.y,
        lon: doc.x
      }));
      return NextResponse.json(result);
    }

    // 결과가 없으면 빈 배열 반환
    return NextResponse.json([]);
  } catch (error: any) {
    console.error('Kakao Geocoding error:', error);
    return NextResponse.json({ error: 'Failed to fetch geocode' }, { status: 500 });
  }
}
