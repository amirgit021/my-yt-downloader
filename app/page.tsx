'use client';
import { useState } from 'react';

export default function Ytdownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720'); // پیش‌فرض ۷۲۰
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!url) return alert('لطفاً لینک یوتیوب را وارد کنید');
    
    setLoading(true);
    // ساخت آدرس API همراه با کیفیت انتخابی کاربر
    const apiTarget = `/api/download?url=${encodeURIComponent(url)}&quality=${quality}`;
    
    // باز کردن در تب جدید برای جلوگیری از خراب شدن صفحه فعلی
    window.open(apiTarget, '_blank');
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', fontFamily: 'tahoma, sans-serif' }}>
      <h1>YouTube Downloader</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', direction: 'ltr' }}>
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
          <option value="360">360p</option>
          <option value="480">480p</option>
          <option value="720">720p</option>
          <option value="1080">1080p</option>
        </select>
        <button 
          onClick={handleDownload} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer', background: '#ff0000', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
        >
          {loading ? 'Processing...' : 'Download'}
        </button>
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>Note: This app redirects you to the raw video stream.</p>
    </div>
  );
}
