import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Job Portal & Recruitment Platform API',
      version: '0.1.0',
      description: 'Phase 0 API: auth, profiles, companies, jobs, applications, resumes, notifications, admin.',
    },
    servers: [{ url: '/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [],
});
