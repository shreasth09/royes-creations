import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumberAndMobile } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const mobile = searchParams.get('mobile');

    if (!orderNumber || !mobile) {
      return NextResponse.json(
        { success: false, message: 'Please provide both your Order ID and Mobile Number.' },
        { status: 400 }
      );
    }

    const order = getOrderByNumberAndMobile(orderNumber, mobile);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'No order found matching this Order ID and Mobile Number. Please verify your details.',
        },
        { status: 404 }
      );
    }

    // Mask sensitive details slightly if public, but return everything needed for tracking
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        mobile: order.mobile.replace(/(\d{2})\d{4}(\d{4})/, '$1****$2'),
        house_flat: order.house_flat,
        street_area: order.street_area,
        landmark: order.landmark,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal: order.subtotal,
        delivery_charge: order.delivery_charge,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        utr: order.utr ? order.utr.replace(/.(?=.{4})/g, '*') : null,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: order.items,
      },
    });
  } catch (error: any) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve tracking information', error: error.message },
      { status: 500 }
    );
  }
}
