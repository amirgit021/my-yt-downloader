import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // استفاده از یک سرویس رایگان برای تبدیل لینک یوتیوب به لینک دانلود
    const response = await fetch(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&q=hd720`);
    const data = await response.text();

    // ما لینک مستقیم را از پاسخ سرویس استخراج می‌کنیم
    // این سرویس لینک دانلود را به صورت HTML برمی‌گرداند
    const match = data.match(/href="([^"]+)"/);
    const downloadUrl = match ? match[1] : null;

    if (!downloadUrl) {
      throw new Error('Could not find download link');
    }

    return NextResponse.redirect(downloadUrl, 302);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
