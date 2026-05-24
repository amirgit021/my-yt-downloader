import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const quality = searchParams.get('quality') || 'best';

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // استفاده از yt-dlp برای گرفتن لینک مستقیم دانلود
    // -g: لینک مستقیم را می‌دهد
    // -f: کیفیت را تعیین می‌کند
    const command = `yt-dlp -g -f "bestvideo[height<=${quality}]+bestaudio/best" ${url}`;
    const downloadUrl = execSync(command).toString().trim();

    return NextResponse.redirect(downloadUrl, 302);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
