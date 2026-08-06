'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import './checklist.css';

export default function ChecklistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  // Dynamically import Map to avoid SSR issues with Leaflet
  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { ssr: false }), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/checklist', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('체크리스트가 성공적으로 저장되었습니다.');
        router.push('/');
      } else {
        const err = await response.json();
        alert('저장 중 오류가 발생했습니다: ' + err.error);
      }
    } catch (error: any) {
      alert('요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderRadios = (name: string, label: string) => (
    <div className="form-group row-group">
      <label>{label}</label>
      <div className="radio-group">
        <label><input type="radio" name={name} value="예" required /> 예</label>
        <label><input type="radio" name={name} value="보통" /> 보통</label>
        <label><input type="radio" name={name} value="아니오" /> 아니오</label>
      </div>
    </div>
  );

  return (
    <div className="container checklist-container">
      <h1 className="title">공개공지 현장조사 체크리스트</h1>
      
      <form onSubmit={handleSubmit} className="checklist-form">
        <section className="form-section">
          <h2>기본 정보</h2>
          <div className="form-group">
            <label>현장조사자</label>
            <input type="text" name="investigator" required />
          </div>
          <div className="form-group">
            <label>건축물명</label>
            <input type="text" name="buildingName" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>주소</label>
            <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <Map address={address} buildingName={buildingName} onLocationFound={(l, ln) => { setLat(l); setLon(ln); }} />
            <input type="hidden" name="lat" value={lat || ''} />
            <input type="hidden" name="lon" value={lon || ''} />
          </div>
          <div className="form-group">
            <label>공개공지면적 (㎡)</label>
            <input type="text" name="area" />
          </div>
          <div className="form-group">
            <label>공개공지유형</label>
            <input type="text" name="type" />
          </div>
        </section>

        <section className="form-section">
          <h2>접근성</h2>
          {renderRadios('q_access_1', '주변의 건축물, 가로, 공원과 유기적으로 연계되는가?')}
          {renderRadios('q_access_2', '단차, 담장, 방음벽 등의 접근성을 저해하는 장애요소는 없는가?')}
          {renderRadios('q_access_3', '주변 가로에서 쉽게 접근할 수 있는가?')}
          {renderRadios('q_access_4', '보행자 동선과 차량동선 등 목적별 동선은 분리되었는가?')}
          {renderRadios('q_access_5', '쉽게 인지할 수 있는 장소에 안내 표지판을 설치하는가?')}
        </section>

        <section className="form-section">
          <h2>안전성 / 편의성</h2>
          {renderRadios('q_safety_1', '방범, 범죄예방 등 치안 및 보안에 안전한가?')}
          {renderRadios('q_safety_2', '야간이용을 위한 적절한 조명계획은 반영되었는가?')}
          {renderRadios('q_safety_3', '경사로의 미끄럼방지시설 등 이용자의 안전을 고려하였는가?')}
          {renderRadios('q_safety_4', '장애인·노약자 이용에도 불편함이 없도록 시설물과 공간의 디자인을 고려하였는가?')}
          {renderRadios('q_safety_5', '에어콘 실외기, 환기구, 기계설비 등은 공개공지와 분리되어 이용자가 불편을 느끼지 않게 하였는가?')}
        </section>

        <section className="form-section">
          <h2>활동성</h2>
          {renderRadios('q_activity_1', '공개공지의 유형별 적절한 활동이 발생할 수 있는가?')}
          {renderRadios('q_activity_2', '기능에 맞게 규모와 크기는 적절한가?')}
          {renderRadios('q_activity_3', '공간구성 및 시설배치는 이용자 편의를 중점 고려하였는가?')}
          {renderRadios('q_activity_4', '서비스 시설과 연계성은 고려하였는가?')}
        </section>

        <section className="form-section">
          <h2>정체성 / 지역성</h2>
          {renderRadios('q_identity_1', '지역의 역사·문화적 환경을 충분히 고려하여 설계되었는가?')}
          {renderRadios('q_identity_2', '주변환경과 어울리는 재료 및 색채로 설계되었는가?')}
          {renderRadios('q_identity_3', '벤치, 가로등, 조형물 등 설치시설물의 디자인은 건물과 어울리도록 설계되었는가?')}
        </section>

        <section className="form-section">
          <h2>지속가능성</h2>
          {renderRadios('q_sustainability_1', '주변의 향후 개발계획을 고려하여 합리적으로 계획하였는가?')}
          {renderRadios('q_sustainability_2', '장소의 특징과 도시환경을 고려하였는가?')}
          {renderRadios('q_sustainability_3', '내구성 있고 교체가 용이한 재료를 사용하였는가?')}
          {renderRadios('q_sustainability_4', '친환경적(투수성)이고, 유지관리가 용이하도록 계획하였는가?')}
        </section>

        <section className="form-section" id="idea-section">
          <h2>현장사진 및 활용계획</h2>
          <div className="form-group">
            <label>사진 1 촬영/업로드</label>
            <input type="file" name="photo1" accept="image/*" />
          </div>
          <div className="form-group">
            <label>사진 2 촬영/업로드</label>
            <input type="file" name="photo2" accept="image/*" />
          </div>
          <div className="form-group">
            <label>활용 아이디어 1</label>
            <input type="text" name="idea1" />
          </div>
          <div className="form-group">
            <label>활용 아이디어 2</label>
            <input type="text" name="idea2" />
          </div>
          <div className="form-group">
            <label>활용 아이디어 3</label>
            <input type="text" name="idea3" />
          </div>
        </section>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? '저장 중...' : '제출하기'}
        </button>
      </form>
    </div>
  );
}
