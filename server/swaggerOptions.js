module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Budget API',
      version: '1.0.0',
      description: 'Tracks transactions & categories'
    },
    servers: [{ url: `${process.env.SERVER_URL}/api/v1` }]
  },
  apis: ['./routes/*.js']  // JSDoc in your route files
};
