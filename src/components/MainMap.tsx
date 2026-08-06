'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Place {
  id: string;
  buildingName: string;
  address: string;
  photo1: string;
  photo2: string;
  idea1: string;
  idea2: string;
  idea3: string;
  lat: number;
  lon: number;
}

export default function MainMap() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const res = await fetch('/api/places');
        const data = await res.json();
        if (data.success) {
          setPlaces(data.places);
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>데이터를 불러오는 중입니다...</div>;
  }

  // Default center: Busanjin-gu
  const defaultCenter: [number, number] = [35.1631, 129.0536];

  return (
    <div style={{ height: 'calc(100vh - 60px)', width: '100%', zIndex: 0 }}>
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place, idx) => (
          <Marker key={place.id || idx} position={[place.lat, place.lon]}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: 'var(--primary-color)' }}>
                  {place.buildingName || '건축물명 미상'}
                </h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {place.address}
                </p>
                
                {place.photo1 && (
                  <div style={{ marginBottom: '10px' }}>
                    <a href={place.photo1} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '5px', backgroundColor: '#f0f4f8', borderRadius: '4px', textDecoration: 'none', textAlign: 'center', fontSize: '12px' }}>📷 현장 사진 보기</a>
                  </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ fontSize: '12px' }}>기존 제안 아이디어:</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: 'var(--text-color)' }}>
                    {place.idea1 ? <li>{place.idea1}</li> : null}
                    {place.idea2 ? <li>{place.idea2}</li> : null}
                    {place.idea3 ? <li>{place.idea3}</li> : null}
                    {!place.idea1 && !place.idea2 && !place.idea3 && <li>아직 제안된 아이디어가 없습니다.</li>}
                  </ul>
                </div>

                <button 
                  onClick={() => window.location.href = `/propose/${place.id}?buildingName=${encodeURIComponent(place.buildingName || '건축물명 미상')}`}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🎉 이벤트 제안하기
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
