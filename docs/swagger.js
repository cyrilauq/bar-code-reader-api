const User = require('../module/user').User;

const generateSchema = obj => {
    const schema = {
        type: 'object',
        properties: {},
    };

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propertyValue = obj[key];
            // You might want to add more logic to determine the type of each property
            schema.properties[key] = {
                type: typeof propertyValue,
                example: propertyValue,
            };
        }
    }

    return schema;
};

/* Swagger configuration */
const options = {
    openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
    language: 'en-US',      // Change response language. By default is 'en-US'
    disableLogs: false,     // Enable/Disable logs. By default is false
    autoHeaders: false,     // Enable/Disable automatic headers capture. By default is true
    autoQuery: false,       // Enable/Disable automatic query capture. By default is true
    autoBody: false         // Enable/Disable automatic body capture. By default is true
}

const swaggerAutogen = require('swagger-autogen')(options);

const doc = {
    info: {
        version: '1.0.0',      // by default: '1.0.0'
        title: 'Barre Code REST API',        // by default: 'REST API'
        description: 'API for managing product add in inventory, user authentication, ...',  // by default: ''
        contact: {
            'name': 'API Support',
            'email': 'rajputankit22@gmail.com'
        },
    },
    host: 'localhost:3300',      // by default: 'localhost:3000'
    basePath: '/',  // by default: '/'
    schemes: ['http'],   // by default: ['http']
    consumes: ['application/json'],  // by default: ['application/json']
    produces: ['application/json'],  // by default: ['application/json']
    tags: [],
    securityDefinitions: {
        "Authorization": {
            "type": "apiKey",
            "name": "authorization",
            "in": "header",
            "description": "Authentication token"
        }
    },  // by default: empty object
    components: {
        schemas: {
            User: generateSchema(new User("John", "Doe", "johndoe077", "johndoe077@api.com", "Password123@")),
            Login: generateSchema({ login: "johndoe077", password: "Password123@" })
        },
        securitySchems: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    },
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['./server.js', './routes/*.js', '.controllers/*.js'];

exports.swagger = () => swaggerAutogen(outputFile, endpointsFiles, doc);
