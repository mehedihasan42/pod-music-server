const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


app.use(cors({
  origin:["https://pod-music-server-side.vercel.app"],
  methods: ["POST","GET","DELETE"],
  credentials:true
}));
app.use(express.json());
// app.use(express.static("dist"))

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.watftgx.mongodb.net/?retryWrites=true&w=majority`;

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

    const musicCollection = client.db("pod-music").collection("musics");
    const saveMusicCollection = client.db("pod-music").collection("saved");
    const usersMusicCollection = client.db("pod-music").collection("users");

    

    app.get('/api/music',async(req,res)=>{
      const music = await musicCollection.find().toArray()
      res.send(music)
    })

    app.get('/api/saved',async(req,res)=>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }

      const query = {email:email}
      const result = await saveMusicCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/api/saved',async(req,res)=>{
      const item = req.body;
      const result = await saveMusicCollection.insertOne(item)
      res.send(result)
    })

    app.delete('/api/saved/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await saveMusicCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/api/users',async(req,res)=>{
      const user = req.body;
      const result = await usersMusicCollection.insertOne(user)
      res.send(result)
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


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })