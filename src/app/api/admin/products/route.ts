import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { getProducts, createProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Admins can see inactive products too
    const products = getProducts({ onlyActive: false });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, original_price, description, image, images, category, specifications, stock, active, is_featured } = body;

    if (!name || !price || !image) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and product image are required.' },
        { status: 400 }
      );
    }

    const created = createProduct({
      name: name.trim(),
      price: parseInt(price, 10),
      original_price: original_price ? parseInt(original_price, 10) : null,
      description: description || '',
      image: image.trim(),
      images: images || [image.trim()],
      category: category || 'Handcrafted',
      specifications: specifications || {},
      stock: stock !== undefined ? parseInt(stock, 10) : 10,
      active: active !== undefined ? (active ? 1 : 0) : 1,
      is_featured: is_featured !== undefined ? (is_featured ? 1 : 0) : 1,
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: created,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product', error: error.message },
      { status: 500 }
    );
  }
}
