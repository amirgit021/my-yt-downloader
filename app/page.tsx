'use client';
import { useState } from 'react';

interface VideoFormat {
  format_id: string;
  ext: string;
  resolution: string;
  filesize: string; // حجم فایل به مگابایت
  url: string;
  has_audio: boolean;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
}

export default function Ytdownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleFetchInfo = async () => {
    if (!url) return alert('لطفاً لینک یوتیوب را وارد کنید');
    
    setLoading(true);
    setErrorMsg('');
    setVideoInfo(null);

    try {
      // درخواست به یک API عمومی و قدرتمند که در بک‌انید خود از yt-dlp استفاده می‌کند
      const response = await fetch(`https://co.wuk.sh/api/json`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          vQuality: '1080', // بالاترین کیفیت درخواستی
          isAudioOnly: false,
          disableMetadata: false
        })
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.text || 'خطا در استخراج اطلاعات ویدیو از yt-dlp');
      }

      // اگر لینک مستقیم در ساختار ساده برگشت (مانند پلتفرم Cobalt/yt-dlp)
      if (data.url) {
        setVideoInfo({
          title: data.filename || 'ویدیو یوتیوب',
          thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300', // تامبنیل پیش‌فرض یوتیوب
          duration: 'نامشخص',
          formats: [
            {
              format_id: 'default',
              ext: 'mp4',
              resolution: 'کیفیت هوشمند (میکس صدا و تصویر)',
              filesize: 'محاسبه خودکار در زمان دانلود',
              url: data.url,
              has_audio: true
            }
          ]
        });
      } else {
        throw new Error('فرمت قابل دانلودی یافت نشد.');
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'خطا در ارتباط با هسته دانلودر.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'tahoma, sans-serif', direction: 'rtl', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      <h1 style={{ color: '#e50914', marginBottom: '10px' }}>یوتیوب دانلودر پیشرفته (هسته yt-dlp)</h1>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>قدرتمند، سریع و بدون قطعی لینک</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', width: '100%', maxWidth: '600px' }}>
        <input 
          type="text" 
          placeholder="لینک ویدیو یوتیوب را اینجا وارد کنید..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '14px', flex: 1, borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', direction: 'ltr' }}
        />
        <button 
          onClick={handleFetchInfo} 
          disabled={loading}
          style={{ padding: '14px 25px', cursor: 'pointer', background: '#e50914', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {loading ? 'در حال پردازش...' : 'بررسی لینک'}
        </button>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#fdecea', color: '#d32f2f', padding: '15px', borderRadius: '8px', marginBottom: '20px', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {videoInfo && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '600px' }}>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <img src={videoInfo.thumbnail} alt="کاور ویدیو" style={{ width: '140px', height: '85px', objectFit: 'cover', borderRadius: '6px' }} />
            <div>
              <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#222', textAlign: 'right', lineHeight: '1.4' }}>{videoInfo.title}</h3>
              <span style={{ fontSize: '12px', color: '#777' }}>موتور پردازش: yt-dlp core</span>
            </div>
          </div>

          <h4 style={{ margin: '0 0 15px 0', color: '#444', textAlign: 'right' }}>لینک دانلود مستقیم اختصاصی:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {videoInfo.formats.map((format, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eef2f5', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', color: '#1b5e20', fontSize: '14px' }}>{format.resolution}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>حجم تخمینی: {format.filesize} | فرمت: {format.ext}</span>
                </div>
                <a 
                  href={format.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ textDecoration: 'none', background: '#2e7d32', color: 'white', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}
                >
                  شروع دانلود
                </a>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
