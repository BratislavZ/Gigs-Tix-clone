import axios from 'axios';
import { BASE_URL } from './baseURL';
import { cookies } from 'next/headers';
import { Order } from '@/types/types';

export async function getOrder(orderId: string) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/orders/${orderId}`,
      headers: {
        Host: 'ticketing.dev',
        Cookie: cookies().toString(),
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
