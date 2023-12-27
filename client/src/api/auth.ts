import axios from 'axios';
import { cookies } from 'next/headers';
import { BASE_URL } from './baseURL';

export async function getCurrentUser() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/users/currentuser`,
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
