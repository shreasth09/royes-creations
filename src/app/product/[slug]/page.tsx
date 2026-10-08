import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product Not Found | Royes Creations' };
  }

  return {
    title: `${product.name} | Royes Creations`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Royes Creations (Jaipur)`,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Related products (excluding current)
  const relatedProducts = getProducts({ onlyActive: true, limit: 4 }).filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
