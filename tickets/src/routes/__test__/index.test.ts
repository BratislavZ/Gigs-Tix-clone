import request from 'supertest';

import { app } from '../../app';

async function createTicket() {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'concert',
      price: 20,
    });
}

it('returns a 201 on successful signup', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
