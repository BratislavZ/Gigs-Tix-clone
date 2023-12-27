import request from 'supertest';

import { app } from '../../app';
import mongoose from 'mongoose';

import { Ticket } from '../../models/ticket';
// jest ce svakako da ga importuje iz mocks, jer smo tako definisali u setup
import { producer } from '../../kafka';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  // it doesnt have a cookie because we want to test when user is not authenticated
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'concert',
      price: 20,
    });

  // we are trying to update it with another user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getCookie()) // now its new user, because we are not using the same cookie
    .send({
      title: 'concert2',
      price: 30,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getCookie(); // we want to use the same user for both requests

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'some title',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.getCookie(); // zelimo da koristimo istog korisnika za oba request-a

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'blabla',
      price: 30,
    })
    .expect(200);

  // check if the ticket was updated
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('blabla');
  expect(ticketResponse.body.price).toEqual(30);
});

it('publishes an event', async () => {
  const cookie = global.getCookie(); // same user for both requests

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    });

  const updatedTicketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'blabla',
      price: 30,
    })
    .expect(200);

  // check if the event was sent
  expect(producer.send).toHaveBeenCalled();

  // 2 mocks are called, one for creating ticket, second for updating
  // we are targeting the second mock (index 1)
  const eventSentData = JSON.parse(
    (producer.send as jest.Mock).mock.calls[1][0].messages[0].value
  );

  expect(eventSentData.title).toEqual(updatedTicketResponse.body.title);
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.getCookie(); // same user for both requests

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    });

  // we manually reserve it because we dont want to depend on another service
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'blabla',
      price: 30,
    })
    .expect(400);
});
