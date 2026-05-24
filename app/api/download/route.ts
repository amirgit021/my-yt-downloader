import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || '720';

  if (!url) {
    return NextResponse.json({ error: 'آدرس ویدیو ارسال نشده است' }, { status: 400 });
  }

  try {
    // ارسال درخواست به بدنه کاملاً بهینه شده نسخه v10
    const response = await fetch('https://api.cobalt.tools/api/deliver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // فقط پارامترهای حیاتی و اجباری نسخه v10 را می‌فرستیم
      body: JSON.stringify({
        url: url,
        videoQuality: quality
      })
    });

    const data = await response.json();

    // اگر سرور کبالت به هر دلیلی ارور داد (مثل همان ارور v7 یا محدودیت‌ها)
    if (!response.ok) {
      throw new Error(data.text || 'سرور کبالت درخواست را رد کرد.');
    }

    // اگر لینک مستقیم با موفقیت ساخته شد
    if (data && data.url) {
      return NextResponse.redirect(data.url, 302);
    } else {
      throw new Error('لینک دانلود در پاسخ سرور یافت نشد.');
    }

  } catch (error: any) {
    console.error('Download Error:', error);
    return NextResponse.json({ 
      error: 'خطا در فرآیند دریافت ویدیو',
      details: error.message 
    }, { status: 500 });
  }
}
