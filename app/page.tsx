'use client';
import { useState } from 'react';

interface VideoFormat {
  quality: string;
  url: string;
  size?: string; // حجم فایل
  ext: string;
}

interface VideoData {
  title: string;
  thumbnail: string;
  duration?: string;
  formats: VideoFormat[];
}

export default function Ytdownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // مرحله اول: بررسی لینک و دریافت اطلاعات ویدیو و کیفیت‌ها
  const handleFetchInfo = async () => {
    if (!url) return alert('لطفاً لینک یوتیوب را وارد کنید');
    
    setLoading(true);
    setErrorMsg('');
    setVideoData(null);

    try {
      // استفاده از API قدرتمند Publer برای دریافت اطلاعات و حجم فایل‌ها
      const response = await fetch('https://api.publer.io/v1/tools/media-downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
      });

      if (!response.ok) {
        throw new Error('سرور نتوانست اطلاعات این ویدیو را دریافت کند. لطفاً لینک را بررسی کنید.');
      }

      const data = await response.json();

      // ساختاردهی به داده‌های دریافتی برای نمایش در فرانت‌اند
      if (data && data.payload && data.payload.length > 0) {
        const payload = data.payload[0];
        
        // استخراج فرمت‌های مختلف ویدیو
        const availableFormats: VideoFormat[] = (payload.links || []).map((link: any) => {
          // محاسبه حجم فایل به مگابایت در صورت وجود
          let sizeStr = 'نامشخص';
          if (link.size) {
            sizeStr = (link.size / (1024 * 1024)).toFixed(1) + ' MB';
          }

          return {
            quality: link.quality || 'کیفیت معمولی',
            url: link.url,
            size: sizeStr,
            ext: link.ext || 'mp4'
          };
        });

        setVideoData({
          title: payload.title || 'ویدیو یوتیوب',
          thumbnail: payload.thumbnail || 'https://via.placeholder.com/300x180?text=No+Thumbnail',
          duration: payload.duration,
          formats: availableFormats
        });

      } else {
        throw new Error('هیچ فرمت قابل دانلودی برای این لینک پیدا نشد.');
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'tahoma, sans-serif', direction: 'rtl', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      
      <h1 style={{ color: '#ff0000', marginBottom: '30px' }}>یوتیوب دانلودر پیشرفته</h1>
      
      {/* باکس دریافت لینک */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', width: '100%', maxWidth: '600px' }}>
        <input 
          type="text" 
          placeholder="لینک ویدیو یوتیوب را اینجا پیست کنید..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '12px', flex: 1, borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
        />
        <button 
          onClick={handleFetchInfo} 
          disabled={loading}
          style={{ padding: '12px 25px', cursor: 'pointer', background: '#ff0000', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', transition: '0.3s' }}
        >
          {loading ? 'در حال بررسی...' : 'بررسی لینک'}
        </button>
      </div>

      {/* نمایش خطا در صورت وجود */}
      {errorMsg && (
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', width: '100%', maxWidth: '600px', textAlign: 'center', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      {/* بخش پیش‌نمایش و کیفیت‌ها (Preview & Formats) */}
      {videoData && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '100%', maxWidth: '600px' }}>
          
          {/* کارت پیش‌نمایش ویدیو */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <img 
              src={videoData.thumbnail} 
              alt={videoData.title} 
              style={{ width: '160px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <h3 style={{ fontSize: '15px', margin: '0 0 10px 0', color: '#333', lineHeight: '1.4', textAlign: 'right' }}>{videoData.title}</h3>
              {videoData.duration && <span style={{ fontSize: '12px', backgroundColor: '#eee', padding: '3px 8px', borderRadius: '4px', color: '#666' }}>زمان: {videoData.duration}</span>}
            </div>
          </div>

          {/* جدول کیفیت‌ها و حجم‌ها */}
          <h4 style={{ margin: '0 0 15px 0', color: '#555', textAlign: 'right' }}>کیفیت‌های موجود برای دانلود:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {videoData.formats.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>فرمت ویدیویی یافت نشد.</p>
            ) : (
              videoData.formats.map((format, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fbfbfb' }}>
                  
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '4px 8px', borderRadius: '5px', fontSize: '13px' }}>
                      {format.quality}
                    </span>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      حجم فایل: <strong>{format.size}</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>
                      {format.ext}
                    </span>
                  </div>

                  <a 
                    href={format.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ textDecoration: 'none', background: '#2196f3', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', transition: '0.3s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#0b7dda')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#2196f3')}
                  >
                    دانلود ویدیو
                  </a>

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
