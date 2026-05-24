'use client';
import { useState } from 'react';

export default function Ytdownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('1080');

  const handleDownload = () => {
    if (!url) return alert('Please enter a URL');
    window.location.href = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>YouTube Downloader</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Paste YouTube URL here..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '10px', width: '400px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select 
          value={quality} 
          onChange={(e) => setQuality(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value="144">144p</option>
          <option value="360">360p</option>
          <option value="480">480p</option>
          <option value="720">720p</option>
          <option value="1080">1080p</option>
          <option value="2160">4K</option>
        </select>
        <button onClick={handleDownload} style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff0000', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Download
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>Note: This app redirects you to the raw video stream provided by YouTube servers.</p>
    </div>
  );
}
