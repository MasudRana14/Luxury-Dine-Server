const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ousunhm.mongodb.net/?retryWrites=true&w=majority`;

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


    const foodCollection = client.db('foodDB').collection('foods');

    const orderCollection = client.db('foodDB').collection('order');

    // get all foods data 
    app.get('/foods', async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

  

    // get single food data 
    app.get('/foods/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(filter);
      res.send(result);
    })


    // Post food data on mongodb 
    app.post('/foods', async (req, res) => {
      const newFoods = req.body;
      const result = await foodCollection.insertOne(newFoods);
      res.send(result);
    })



    // Post Order Food On mongodb 
    app.post('/order', async (req, res) => {
      const orderFoods = req.body;
      const result = await orderCollection.insertOne(orderFoods);
      res.send(result);
    })



      // get My Order foods Items 
      app.get('/order', async (req, res) => {
        const cursor = orderCollection.find();
        const result = await cursor.toArray();
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
  res.send('Restaurant management is running')
})

app.listen(port, () => {
  console.log(`Restaurant Management Server Is Running On Port ${port}`)
})