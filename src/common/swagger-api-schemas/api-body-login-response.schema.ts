export const ApiBodyLoginResponseSchema = (desc: string) => {
  return {
    description: desc,
    schema: {
      type: 'object',
      properties: {
        username: { type: 'number' },
        password: { type: 'string' },
      },
      example: {
        username: 'loppo',
        password: '932kdlpp',
      },
    },
  };
};
