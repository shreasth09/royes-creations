import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Basic file validation
    const mimeType = file.type;
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(mimeType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Only JPEG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Max 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';

    // Attempt local filesystem write; if on Vercel or read-only filesystem, gracefully fallback to Data URI
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = file.name.split('.').pop() || 'png';
      const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '');
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      // Vercel serverless read-only filesystem fallback: convert to base64 Data URI
      // Data URIs render natively in HTML <img> tags and save directly in DB without external storage buckets
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: 'File upload failed', error: error.message },
      { status: 500 }
    );
  }
}
