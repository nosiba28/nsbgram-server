const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ay2ityn.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const postsCollection = client.db('nsbgramDB').collection('posts');
        const aboutCollection = client.db('nsbgramDB').collection('aboutME');

        app.get('/posts', async (req, res) => {
            // console.log(req.query);
            const cursor = postsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/myDescendingPosts', async (req, res) => {
            let query = {};
            if (req.query?._id) {
                query = { _id: req.query._id }
            }
            const cursor = postsCollection.find(query).sort({ "_id": -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/myposts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await postsCollection.findOne(query);
            res.send(result);
        })

        app.get('/about-me', async (req, res) => {
            // console.log(req.query);
            const cursor = aboutCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        
        app.post('/posts', async (req, res) => {
            const newPost = req.body;
            console.log(newPost);
            const result = await postsCollection.insertOne(newPost);
            res.send(result);
        })
        app.get('/about-me/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await aboutCollection.findOne(query);
            res.send(result);
        })
        app.patch('/about-me/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedInfo = req.body;
            console.log(updatedInfo);

            const updateDoc = {
                $set: {
                    Name: updatedInfo.Name,
                    Email: updatedInfo.Email,
                    University: updatedInfo.University,
                    Address: updatedInfo.Address
                },
            };

            const result = await aboutCollection.updateOne(filter, updateDoc);

            res.send(result);
        })

       

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('image server is running');
})
app.listen(port, () => {
    console.log(`image server is running on port: ${port}`)
})