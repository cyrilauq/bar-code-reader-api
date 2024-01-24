const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const cors = require('cors');
const mongoose = require("mongoose");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const routes = require("./routes/router");

const app = express();
const port = 3300;

app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.json({ extended: true }));

app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/product/:barCode", async (req, res, next) => {
    try {
        const result = await axios.get('https://api.upcitemdb.com/prod/trial/lookup?upc=' + req.params.barCode);
        const data = result.data;
        console.log(data);
        if (data.items.length === 0) {
            res.status(404).json({ error: "No product found" });
        }
        res.status(200).json(data.items[0]);
    } catch (error) {
        res.status(500).json({ error: error });
    }
})

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PWD}${process.env.MONGO_URI}`, {
        dbName: process.env.NODE_ENV === "production" ? "prod" : "dev"
    }
    )
    .then(() => {
        require('./docs/swagger').swagger().then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`Server is running on port ${port}`);
            });
        });
    })
    .catch((error) => {
        console.log(error);
    });