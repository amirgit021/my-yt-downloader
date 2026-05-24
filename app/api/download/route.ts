import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '720'; // گرفتن کیفیت از فرانت‌اند

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // ۱. استخراج ویدیو آیدی از لینک یوتیوب
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // ۲. درخواست به API عمومی Invidious برای گرفتن اطلاعات ویدیو
    const response = await fetch(`https://invidious.nerdvpn.de/api/v1/videos/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Invidious API');
    }

    const data = await response.json();

    // ۳. پیدا کردن فرمت و کیفیت مورد نظر کاربر
    // ویدیوهای یوتیوب معمولاً صدا و تصویر جدا دارند، ما فرمت‌های ترکیبی (قالب ۳۶0p یا 720p معمولی) را ترجیح می‌دهیم
    let selectedStream = data.formatStreams.find((stream: any) => stream.qualityLabel === `${quality}p`);
    
    // اگر کیفیت انتخاب شده پیدا نشد، اولین کیفیت موجود ترکیبی را بردار
    if (!selectedStream && data.formatStreams.length > 0) {
      selectedStream = data.formatStreams[0];
    }

    if (!selectedStream || !selectedStream.url) {
      throw new Error('Download URL not found');
    }

    // ۴. انتقال کاربر به لینک مستقیم دانلود ویدیو
    return NextResponse.redirect(selectedStream.url, 302);

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch video' }, { status: 500 });
  }
}
