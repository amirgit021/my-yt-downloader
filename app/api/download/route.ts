import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '720';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // فرستادن درخواست به API قدرتمند و رایگان Cobalt
    const response = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: quality, // کیفیت انتخابی کاربر (مثلا 720 یا 1080)
        downloadMode: 'auto'
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.text || 'Cobalt API failed to process the video');
    }

    const data = await response.json();

    // Cobalt لینک مستقیم دانلود را در پراپرتی url برمی‌گرداند
    if (data && data.url) {
      return NextResponse.redirect(data.url, 302);
    } else {
      throw new Error('No download URL returned from API');
    }

  } catch (error: any) {
    console.error('Download Error:', error);
    return NextResponse.json({ 
      error: 'خطا در دریافت ویدیو. ممکن است لینک اشتباه باشد یا سرور شلوغ باشد.',
      details: error.message 
    }, { status: 500 });
  }
}
