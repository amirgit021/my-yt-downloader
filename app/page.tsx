'use client';
import { useState } from 'react';

interface VideoFormat {
  quality: string;
  url: string;
  size: string;
  ext: string;
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
      // استفاده از سرور معکوس و پایدار بر پایه yt-dlp
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://ytdl.prod-api.xyz/api/info?url=' + url)}`);
      
      if (!response.ok) {
        throw new Error('ارتباط با سرور yt-dlp برقرار نشد.');
      }

      const resData = await response.json();
      const data = JSON.parse(resData.contents);

      if (data.error || !data.formats) {
        throw new Error(data.message || 'yt-dlp نتوانست اطلاعات این لینک را استخراج کند.');
      }

      // فیلتر کردن و مرتب‌سازی فرمت‌های ویدیویی که هم صدا دارند و هم تصویر
      const rawFormats = data.formats.filter((f: any) => f.vcodec !== 'none' && f.acodec !== 'none');
      
      const processedFormats: VideoFormat[] = rawFormats.map((f: any) => {
        // محاسبه حجم فایل
        let sizeStr = 'نامشخص';
        if (f.filesize) {
          sizeStr = (f.filesize / (1024 * 1024)).toFixed(1) + ' MB';
        } else if (f.filesize_approx) {
          sizeStr = (f.filesize_approx / (1024 * 1024)).toFixed(1) + ' MB (تخمینی)';
        }

        return {
          quality: f.format_note || f.resolution || 'کیفیت معمولی',
          url: f.url,
          size: sizeStr,
          ext: f.ext || 'mp4'
        };
      });

      // حذف کیفیت‌های تکراری برای خلوت شدن لیست
      const uniqueFormats = processedFormats.filter((value, index, self) =>
        index === self.findIndex((t) => t.quality === value.quality && t.size === value.size)
      );

      setVideoInfo({
        title: data.title || 'ویدیو یوتیوب',
        thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300',
        duration: data.duration_string || 'نامشخص',
        formats: uniqueFormats
      });

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'خطا در استخراج اطلاعات ویدیو. ممکن است لینک اشتباه باشد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'tahoma, sans-serif', direction: 'rtl', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#ff0000', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>یوتیوب دانلودر پیشرفته</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>الگوبرداری شده از موتور قدرتمند yt-dlp core</p>
      </div>
      
      {/* باکس جستجو و بررسی لینک */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', width: '100%', maxWidth: '650px' }}>
        <input 
          type="text" 
          placeholder="لینک ویدیو یوتیوب را اینجا وارد کنید..." 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '14px', flex: 1, borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', direction: 'ltr', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
        />
        <button 
          onClick={handleFetchInfo} 
          disabled={loading}
          style={{ padding: '14px 28px', cursor: 'pointer', background: '#ff0000', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(255,0,0,0.2)' }}
        >
          {loading ? 'در حال بررسی...' : 'بررسی لینک'}
        </button>
      </div>

      {/* نمایش پیام خطا */}
      {errorMsg && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '15px', borderRadius: '10px', marginBottom: '25px', width: '100%', maxWidth: '650px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fee2e2' }}>
          {errorMsg}
        </div>
      )}

      {/* کامپوننت پیش‌نمایش و لیست دانلود (Preview & Quality List) */}
      {videoInfo && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '650px', border: '1px solid #f1f5f9' }}>
          
          {/* بخش Preview (عکس و مشخصات) */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', flexWrap: 'wrap' }}>
            <img 
              src={videoInfo.thumbnail} 
              alt={videoInfo.title} 
              style={{ width: '180px', height: '110px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
            />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ fontSize: '16px', margin: '0 0 12px 0', color: '#1e293b', textAlign: 'right', lineHeight: '1.5', fontWeight: 'bold' }}>{videoInfo.title}</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#475569', fontWeight: 'bold' }}>مدت زمان: {videoInfo.duration}</span>
                <span style={{ fontSize: '12px', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '6px', color: '#0369a1', fontWeight: 'bold' }}>هسته: yt-dlp</span>
              </div>
            </div>
          </div>

          <h4 style={{ margin: '0 0 15px 0', color: '#475569', textAlign: 'right', fontSize: '15px', fontWeight: 'bold' }}>انتخاب کیفیت و حجم برای دانلود:</h4>
          
          {/* جدول فرمت‌ها */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {videoInfo.formats.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px' }}>متاسفانه فرمت مستقیمی پیدا نشد. لینک دیگری را امتحان کنید.</p>
            ) : (
              videoInfo.formats.map((format, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc', transition: 'all 0.2s' }}>
                  
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#15803d', backgroundColor: '#dcfce7', padding: '5px 10px', borderRadius: '6px', fontSize: '13px' }}>
                      {format.quality}
                    </span>
                    <span style={{ fontSize: '14px', color: '#334155' }}>
                      حجم: <strong style={{ color: '#0f172a' }}>{format.size}</strong>
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {format.ext}
                    </span>
                  </div>

                  <a 
                    href={format.url} 
                    target="_blank" 
                    rel="noreferrer"
                    download={`${videoInfo.title}.${format.ext}`}
                    style={{ textDecoration: 'none', background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37,99,235,0.15)', transition: 'background 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
                  >
                    دانلود مستقیم
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
