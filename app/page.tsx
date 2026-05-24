'use client';
import { useState } from 'react';

export default function Ytdownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDownload = async () => {
    if (!url) return alert('لطفاً لینک یوتیوب را وارد کنید');
    
    setLoading(true);
    setErrorMsg('');

    try {
      // مرورگر مستقیماً و بدون نیاز به نتلیفای به سرور کبالت نسخه جدید وصل می‌شود
      const response = await fetch('https://api.cobalt.tools/api/deliver', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          videoQuality: quality
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.text || 'سرور با خطا مواجه شد. دوباره تلاش کنید.');
      }

      if (data && data.url) {
        // باز کردن لینک مستقیم دانلود ویدیو در تب جدید
        window.open(data.url, '_blank');
      } else {
        throw new Error('لینک دانلود پیدا نشد.');
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', fontFamily: 'tahoma, sans-serif', direction: 'rtl' }}>
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
          {loading ? 'در حال پردازش...' : 'Download'}
        </button>
      </div>
      
      {errorMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</p>}
      
      <p style={{ fontSize: '12px', color: '#666' }}>Note: This app redirects you directly to the raw video stream.</p>
    </div>
  );
}
