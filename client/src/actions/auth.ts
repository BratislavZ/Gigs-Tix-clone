'use server';

import { BASE_URL } from '@/api/baseURL';
import { paths } from '@/paths';
import { AuthFormState } from '@/types/form-types';
import axios, { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createPostSchema = z.object({
  email: z.string().email({ message: 'Email must be valid.' }),
  password: z
    .string()
    .trim()
    .min(4, { message: 'Password must have more than 4 characters.' })
    .max(20, { message: 'Password must have less than 20 characters.' }),
});

export async function signUp(form: {
  email: string;
  password: string;
}): Promise<AuthFormState> {
  const result = createPostSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/users/signup`,
      headers: {
        Host: 'ticketing.dev',
      },
      data: {
        email: result.data.email,
        password: result.data.password,
      },
    });
    const { token } = response.data;

    cookies().set('token', token, {
      maxAge: 48 * 60 * 60, // valid for 2 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
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
    } else {
      return {
        success: false,
        errors: {
          _form: ['Something went wrong.'],
        },
      };
    }
  }

  return {
    success: true,
    errors: {},
  };
}

export async function signIn(form: {
  email: string;
  password: string;
}): Promise<AuthFormState> {
  const result = createPostSchema.safeParse({
    email: form.email,
    password: form.password,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/users/signin`,
      headers: {
        Host: 'ticketing.dev',
      },
      data: {
        email: result.data.email,
        password: result.data.password,
      },
    });
    const { token } = response.data;

    cookies().set('token', token, {
      maxAge: 48 * 60 * 60, // valid for 2 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
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
    } else {
      return {
        success: false,
        errors: {
          _form: ['Something went wrong.'],
        },
      };
    }
  }

  return {
    success: true,
    errors: {},
  };
}

export async function logout() {
  try {
    const response = await axios(`${BASE_URL}/api/users/signout`, {
      method: 'POST',
      headers: {
        Host: 'ticketing.dev',
      },
    });

    console.log(response.data);
    cookies().delete('token');
    revalidatePath(paths.home());
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data.errors);
      return {
        success: false,
      };
    }
  }
  return {
    success: true,
  };
}
