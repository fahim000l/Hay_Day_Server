const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Hay Day Server');
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tzinyke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    const servicesCollection = client.db('hayday-db').collection('services');
    const reviewsCollection = client.db('hayday-db').collection('reviews');

    app.get('/services', async (req, res) => {
        let query = {};
        const cursor = servicesCollection.find(query);
        if (req.query.quantity == 3) {
            const result = await cursor.limit(3).toArray();
            res.send(result);
        }
        else {
            const result = await cursor.toArray();
            res.send(result);
        }
    });

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.send(service);
    });

    app.get('/reviews', async (req, res) => {
        let query = {};
        if (req.query.email) {
            query = { email: req.query.email };
        }
        const cursor = reviewsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

    app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewsCollection.findOne(query);
        res.send(result);
    });

    app.get('/servicereviews/:serviceid', async (req, res) => {
        const serviceid = req.params.serviceid;
        const query = { serviceId: serviceid };
        const cursor = reviewsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

    app.post('/servicereviews/:serviceid', async (req, res) => {
        const service = req.body;
        const result = await reviewsCollection.insertOne(service);
        console.log(result);
        res.send(result);
    });

}

run().catch(err => console.error(err));


app.listen(port, () => {
    console.log('Hay Day server is running on port :', port);
});