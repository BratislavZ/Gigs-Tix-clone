const consumer = {};

const producer = {
  send: jest
    .fn()
    .mockImplementation(
      (topic: string, messages: Array<{ value: string }>) => {}
    ),
};

export { consumer, producer };
