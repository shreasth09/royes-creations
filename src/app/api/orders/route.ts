import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getProductById } from '@/lib/db';
import { validateJaipurLocation, calculateDeliveryCharge } from '@/lib/delivery';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      mobile,
      email,
      house_flat,
      street_area,
      landmark,
      city,
      state,
      pincode,
      utr,
      payment_screenshot,
      notes,
      items,
    } = body;

    // 1. Validate Customer Information
    if (!customer_name || customer_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid full name.' },
        { status: 400 }
      );
    }

    const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';
    if (!cleanMobile || cleanMobile.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    // 2. Validate Address fields
    if (!house_flat || !street_area) {
      return NextResponse.json(
        { success: false, message: 'Please provide complete house/flat and street/area address.' },
        { status: 400 }
      );
    }

    // 3. Strict Jaipur Location Enforcement
    const locationCheck = validateJaipurLocation(pincode, city || 'Jaipur', state || 'Rajasthan');
    if (!locationCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: locationCheck.message || 'We currently deliver exclusively within Jaipur, Rajasthan.',
        },
        { status: 400 }
      );
    }

    // 4. Validate Items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty. Please add products to proceed.' },
        { status: 400 }
      );
    }

    // 5. Server-Side Price & Subtotal Recalculation (ANTI-TAMPERING)
    let calculatedSubtotal = 0;
    const validatedItems: {
      product_id: number;
      product_name_snapshot: string;
      product_image_snapshot: string;
      price_snapshot: number;
      quantity: number;
      item_total: number;
    }[] = [];

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const product = getProductById(Number(item.productId || item.product_id || item.id));

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product with ID ${item.productId || item.id} is no longer available.` },
          { status: 400 }
        );
      }

      if (!product.active) {
        return NextResponse.json(
          { success: false, message: `Product "${product.name}" is currently unavailable.` },
          { status: 400 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        product_image_snapshot: product.image,
        price_snapshot: product.price,
        quantity,
        item_total: itemTotal,
      });
    }

    // 6. Strict Delivery Charge Rule Enforcement
    // Subtotal <= 1499 => 49
    // Subtotal > 1499  => 0 (FREE DELIVERY)
    const deliveryCharge = calculateDeliveryCharge(calculatedSubtotal);
    const totalAmount = calculatedSubtotal + deliveryCharge;

    // 7. Validate Prepaid UPI UTR / Screenshot
    const cleanUtr = utr ? utr.trim().replace(/\s+/g, '') : '';
    if (!cleanUtr && !payment_screenshot) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide your 12-digit UPI UTR / Transaction ID or upload a payment screenshot to verify payment.',
        },
        { status: 400 }
      );
    }

    // 8. Generate Human-Friendly Order Number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `RC-2026-${randomSuffix}`;

    // 9. Persist Order in Relational Database
    const order = createOrder({
      order_number: orderNumber,
      customer_name: customer_name.trim(),
      mobile: cleanMobile,
      email: email ? email.trim() : undefined,
      house_flat: house_flat.trim(),
      street_area: street_area.trim(),
      landmark: landmark ? landmark.trim() : undefined,
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: pincode.trim(),
      subtotal: calculatedSubtotal,
      delivery_charge: deliveryCharge,
      total_amount: totalAmount,
      payment_method: 'UPI',
      utr: cleanUtr || undefined,
      payment_screenshot: payment_screenshot || undefined,
      notes: notes ? notes.trim() : undefined,
      items: validatedItems,
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully! Payment verification in progress.',
      orderNumber: order.order_number,
      order,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process order. Please try again.', error: error.message },
      { status: 500 }
    );
  }
}
