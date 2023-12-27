'use server';

import { BASE_URL } from '@/api/baseURL';
import { paths } from '@/paths';
import { OrderFormState } from '@/types/form-types';
import axios, { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createOrderSchema = z.object({
  ticketId: z.string().trim().min(1, { message: 'Ticket ID is required.' }),
});

export async function createOrder(ticketId: string): Promise<OrderFormState> {
  const result = createOrderSchema.safeParse({
    ticketId,
  });

  if (!result.success) {
    return {
      success: false,
      errors: {
        _form: [result.error.message],
      },
    };
  }

  let order;

  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/orders`,
      headers: {
        Host: 'ticketing.dev',
        Cookie: cookies().toString(),
      },
      data: {
        ticketId,
      },
    });
    order = response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data.errors[0].message || 'Something went wrong.';
      return {
        success: false,
        errors: {
          _form: [errorMessage],
        },
      };
    }
  }

  revalidatePath(paths.orders());
  return {
    orderId: order?.id,
    success: true,
    errors: {},
  };
}
