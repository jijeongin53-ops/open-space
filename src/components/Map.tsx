'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
  }, [center, map]);
  return null;
}

interface MapProps {
  address: string;
  buildingName: string;
  onLocationFound?: (lat: number, lon: number) => void;
}

export default function Map({ address, buildingName, onLocationFound }: MapProps) {
  const [position, setPosition] = useState<[number, number]>([35.1631, 129.0536]); // Default: Busanjin-gu
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!address) return;
    
    const geocode = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setPosition([lat, lon]);
          if (onLocationFound) onLocationFound(lat, lon);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce/timeout to avoid spamming the API
    const timeout = setTimeout(() => {
      geocode();
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [address]);

  const handleIdeaClick = () => {
    const ideaSection = document.getElementById('idea-section');
    if (ideaSection) {
      ideaSection.scrollIntoView({ behavior: 'smooth' });
      // Focus the first idea input
      setTimeout(() => {
        const firstInput = ideaSection.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 500);
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
      {loading && <div style={{ padding: '10px', textAlign: 'center' }}>위치 검색 중...</div>}
      {error && <div style={{ padding: '10px', textAlign: 'center', color: 'red' }}>주소를 찾을 수 없습니다.</div>}
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} />
        <Marker position={position}>
          <Popup>
            <strong>{buildingName || '건축물명 미입력'}</strong><br />
            {address || '주소 미입력'}<br />
            <button 
              onClick={handleIdeaClick}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              활용 아이디어 제출하기
            </button>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
