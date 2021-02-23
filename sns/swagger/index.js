const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  swagger: "2.0",

  info: {
    title: "ECHO API",
    version: "1.0.0",
    description: "This is a ECHO backend server.",
    termsOfService: "http://swagger.io/terms/",
  },

  host: "/",
  schemes: process.env.RUNNIG_ENV == "server" ? "https" : "http",

  securityDefinitions: {},

  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
};

const options = {
  swaggerDefinition,
  apis: [__dirname + "/*.yaml", __dirname + "/*/*.yaml"],
};

console.log(swaggerJSDoc(options));

module.exports = () => {
  return swaggerJSDoc(options);
};
