import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // استفاده از api رایگان loader.to برای تبدیل لینک یوتیوب به لینک مستقیم
    const response = await fetch(`https://loader.to/api/button/?url=${encodeURIComponent(url)}&q=hd720`);
    const html = await response.text();

    // استخراج لینک دانلود از بین کدهای HTML
    const match = html.match(/href="([^"]+)"/);
    
    if (match && match[1]) {
      const downloadUrl = match[1];
      return NextResponse.redirect(downloadUrl, 302);
    } else {
      throw new Error('Download link not found');
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
