import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getOrderById, updateOrder } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id, 10);
    const order = getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve order', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id, 10);
    const body = await req.json();
    const { order_status, payment_status, admin_notes, utr } = body;

    const updated = updateOrder(orderId, {
      order_status,
      payment_status,
      admin_notes,
      utr,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updated,
    });
  } catch (error: any) {
    console.error('Admin update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order', error: error.message },
      { status: 500 }
    );
  }
}
