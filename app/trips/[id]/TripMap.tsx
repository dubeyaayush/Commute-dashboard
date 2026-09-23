'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GpsPoint } from '@/lib/api';

export default function TripMap({ track }: { track: GpsPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const pts = track
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => [p.lat, p.lng] as [number, number]);
    if (pts.length === 0) return;

    const map = L.map(ref.current);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const line = L.polyline(pts, { color: '#2563eb', weight: 4, opacity: 0.8 }).addTo(map);
    map.fitBounds(line.getBounds(), { padding: [30, 30] });

    // start / end dots
    L.circleMarker(pts[0], { radius: 7, color: '#16a34a', fillColor: '#16a34a', fillOpacity: 1 })
      .addTo(map)
      .bindTooltip('Start');
    L.circleMarker(pts[pts.length - 1], { radius: 7, color: '#dc2626', fillColor: '#dc2626', fillOpacity: 1 })
      .addTo(map)
      .bindTooltip('End');

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [track]);

  if (track.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center rounded-lg border bg-gray-50 text-gray-500 text-sm">
        No GPS track for this trip.
      </div>
    );
  }
  return <div ref={ref} className="h-80 w-full rounded-lg border" />;
}