export const ApiOkResponseSchema = (desc: string) => {
  return {
    description: desc,
    schema: {
      type: 'object',
      properties: {
        username: { type: 'number' },
        password: { type: 'string' },
      },
      example: {
        code: 200,
        status: 'success',
      },
    },
  };
};
