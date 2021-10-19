export const ApiUnauthorizedResponseSchema = (desc: string) => {
  return {
    description: desc,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      },
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  };
};
