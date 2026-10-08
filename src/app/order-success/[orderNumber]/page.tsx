import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/db';
import OrderSuccessClient from './OrderSuccessClient';

interface Props {
  params: { orderNumber: string };
}

export const revalidate = 0;

export default function OrderSuccessPage({ params }: Props) {
  const order = getOrderByNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <OrderSuccessClient order={order} />
    </div>
  );
}
