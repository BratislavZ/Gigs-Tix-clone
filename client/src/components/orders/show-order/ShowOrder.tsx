'use client';

import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Order, User } from '@/types/types';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type Props = {
  order: Order;
  currentUser: User;
};

export default function OrderShow({ order, currentUser }: Props) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(-1);
  const [errors, setErrors] = useState('');

  async function confirmPayment(tokenId: string) {
    try {
      await axios({
        method: 'POST',
        url: '/api/payments',
        data: {
          orderId: order.id,
          token: tokenId,
        },
        headers: {
          Host: 'ticketing.dev',
        },
      });

      router.push('/orders');
    } catch (error) {
      if (isAxiosError(error)) {
        setErrors(error.response?.data);
      }
    }
  }

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      const roundedSeconds = Math.round(msLeft / 1000);
      if (roundedSeconds > 0) {
        setTimeLeft(roundedSeconds);
      } else {
        setTimeLeft(0);
      }
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft === -1) {
    return <div>Loading...</div>;
  }

  if (timeLeft === 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <span>Time left to pay: {timeLeft} seconds</span>
      <StripeCheckout
        token={({ id }) => confirmPayment(id)}
        stripeKey="pk_test_51OHnlMDBm6gG8LcRnjo595Bz8BZXPaLlx91tLR4eXk22WwyHeZMbCYRne2gND6qNsFSTr6nm9C97lDTl5sUNFFFU00F8jvAlbk"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}
