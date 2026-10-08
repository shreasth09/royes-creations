import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getAllStoreSettings, setStoreSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const settings = getAllStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string' || typeof value === 'number') {
        setStoreSetting(key, String(value));
      }
    }

    const updated = getAllStoreSettings();
    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updated,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
