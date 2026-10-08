import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getAllOrders } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const order_status = searchParams.get('order_status') || undefined;
    const payment_status = searchParams.get('payment_status') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

    const result = getAllOrders({
      search,
      order_status,
      payment_status,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      orders: result.orders,
      total: result.total,
    });
  } catch (error: any) {
    console.error('Admin get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve orders', error: error.message },
      { status: 500 }
    );
  }
}
