import axios from 'axios';
import { BASE_URL } from './baseURL';
import { Ticket } from '@/types/types';

export async function getTickets() {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/tickets`,
      headers: {
        Host: 'ticketing.dev',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getTicket(id: string): Promise<Ticket | undefined> {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/tickets/${id}`,
      headers: {
        Host: 'ticketing.dev',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
