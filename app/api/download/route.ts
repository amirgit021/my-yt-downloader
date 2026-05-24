import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '720';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // ۱. استفاده از آدرس جدید و رسمی Cobalt v10
    const response = await fetch('https://api.cobalt.tools/api/deliver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // ۲. ساختار جدید بدنه درخواست (تنظیمات نسخه جدید)
      body: JSON.stringify({
        url: url,
        videoQuality: quality, // کیفیت ویدیو (مثل 360, 480, 720, 1080)
        filenamePattern: 'classic', // نام‌گذاری استاندارد فایل
        isAudioOnly: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.text || 'Cobalt API failed to process the video');
    }

    // ۳. در نسخه جدید، لینک مستقیم دانلود در دیتای بازگشتی و در روت اصلی یا بخش tunnel وجود دارد
    // ساختار پاسخ بسته به نوع ویدیو ممکن است text، url یا status باشد. معمولاً لینک مستقیم در data.url قرار دارد.
    if (data && data.url) {
      return NextResponse.redirect(data.url, 302);
    } else if (data && data.text) {
      // اگر پیامی مبنی بر پردازش یا لینک فرعی داد
      throw new Error(data.text);
    } else {
      throw new Error('No download URL returned from API');
    }

  } catch (error: any) {
    console.error('Download Error:', error);
    return NextResponse.json({ 
      error: 'خطا در ارتباط با سرور دانلود. لطفاً مجدداً تلاش کنید.',
      details: error.message 
    }, { status: 500 });
  }
}
