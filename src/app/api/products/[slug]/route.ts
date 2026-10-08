import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProductById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    let product = getProductBySlug(slug);

    if (!product && !isNaN(Number(slug))) {
      product = getProductById(Number(slug));
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve product', error: error.message },
      { status: 500 }
    );
  }
}
