const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const express = require('express');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2phr5m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const toyCollection = client.db('toyData').collection('toy');

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");



        app.post('/addToy', async (req, res) => {
            const body = req.body;
            const result = await toyCollection.insertOne(body);
            res.send(result);

        })
        app.get('/allToys', async (req, res) => {
            const result = await toyCollection.find({}).toArray();
            res.send(result);

        })
        app.get('/allToys/:Category', async (req, res) => {
            if (req.params.Category == 'MathToys') {
                const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
                return res.send(result);
            }
            else if (req.params.Category == 'EngineeringToys') {
                const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
                return res.send(result);
            }
            else if (req.params.Category == 'LanguageToys') {
                const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
                return res.send(result);
            }
            else {
                const result = await toyCollection.find({}).toArray();
                return res.send(result);
            }

        })

        app.delete('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })




    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Education toys running');
})
app.listen(port, () => {
    console.log(`Educational toys running on port ${port}`);
})
