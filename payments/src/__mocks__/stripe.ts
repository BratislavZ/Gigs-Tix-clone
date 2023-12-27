export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'fake_stripe_id',
    }),
  },
};
