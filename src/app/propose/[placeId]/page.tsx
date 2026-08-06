'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function ProposeEventPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const placeId = params.placeId as string;
  const buildingName = searchParams.get('buildingName') || '이 공개공지';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    proposerEmail: '',
    title: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, placeId, buildingName })
      });
      const data = await res.json();
      
      if (data.success) {
        alert('이벤트 제안이 성공적으로 등록되었습니다. 담당자에게 이메일이 발송되었습니다.');
        router.push('/');
      } else {
        alert('저장 중 오류가 발생했습니다: ' + data.error);
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '600px' }}>
      <h1 style={{ color: 'var(--primary-color)' }}>이벤트 제안하기</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        <strong>{buildingName}</strong>에 대한 멋진 이벤트를 제안해주세요!
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label>회신받을 이메일 주소</label>
          <input 
            type="email" 
            required 
            value={formData.proposerEmail}
            onChange={(e) => setFormData({...formData, proposerEmail: e.target.value})}
            placeholder="example@gmail.com"
          />
        </div>
        
        <div className="form-group">
          <label>이벤트 제목</label>
          <input 
            type="text" 
            required 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="예) 토요일 저녁 버스킹 공연"
          />
        </div>

        <div className="form-group">
          <label>이벤트 상세 내용</label>
          <textarea 
            required 
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="어떤 이벤트를 진행하고 싶은지 상세히 적어주세요."
            style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          {loading ? '제출 및 이메일 발송 중...' : '제안서 제출하기'}
        </button>
      </form>
    </div>
  );
}
