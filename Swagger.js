import swaggerJSDoc from 'swagger-jsdoc';

const doc = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Candidate',
      version: '1.0.0',
      description: 'E-candidate login and signup all the crud '
    },
    servers: [
      {
        url: 'http://localhost:8000'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the file with documented routes
};


  const swagger = swaggerJSDoc(doc)
  
  
  export default swagger