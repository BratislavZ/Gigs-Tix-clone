'use server';

import { BASE_URL } from '@/api/baseURL';
import { paths } from '@/paths';
import { TicketFormState } from '@/types/form-types';
import axios, { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required.' }),
  price: z
    .number({
      required_error: 'Price is required.',
    })
    .positive({ message: 'Price must be greater than 0.' }),
});

export async function createTicket(form: {
  title: string;
  price: string;
}): Promise<TicketFormState> {
  const result = createPostSchema.safeParse({
    title: form.title,
    price: Number(form.price),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  try {
    await axios({
      method: 'POST',
      url: `${BASE_URL}/api/tickets`,
      data: {
        title: form.title,
        price: form.price,
      },
      headers: {
        Host: 'ticketing.dev',
        Cookie: cookies().toString(),
      },
    });
    revalidatePath(paths.home());
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
  return {
    success: true,
    errors: {},
  };
}
