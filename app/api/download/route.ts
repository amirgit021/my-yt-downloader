import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // ارسال درخواست به سرویس واسط برای تبدیل لینک یوتیوب به لینک دانلود
    const response = await fetch(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&q=hd720`);
    const html = await response.text();

    // جستجو برای پیدا کردن لینک مستقیم دانلود در بین کدهای HTML
    const match = html.match(/href="([^"]+)"/);
    
    if (match && match[1]) {
      const downloadUrl = match[1];
      
      // اگر لینک پیدا شده با http شروع می‌شود، کاربر را به آن منتقل کن
      if (downloadUrl.startsWith('http')) {
        return NextResponse.redirect(downloadUrl, 302);
      }
    }

    // اگر لینک پیدا نشد یا لینک درست نبود، کاربر را به صفحه اصلی سرویس بفرست
    // تا خودش بتواند ویدیو را دانلود کند (به جای دیدن کدهای CSS)
    return NextResponse.redirect(`https://loader.to/?url=${encodeURIComponent(url)}`, 302);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process video' }, { status: 500 });
  }
}
