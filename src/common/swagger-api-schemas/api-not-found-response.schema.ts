export const ApiNotFoundResponseSchema = (field: string, desc?: string) => {
  return {
    description: `${field.charAt(0).toUpperCase} not found.`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: `${field.charAt(0).toUpperCase} rango not found`,
        error: 'Not Found',
      },
    },
  };
};
