const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.watftgx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    
    // Get the database and collection on which to run the operation
    const musicCollection = client.db("pod-music").collection("musics");
    const saveMusicCollection = client.db("pod-music").collection("saved");
    const usersMusicCollection = client.db("pod-music").collection("users");

    app.get('/',(req,res)=>{
      res.send('listen a song')
    })

    app.get('/music',async(req,res)=>{
      const music = await musicCollection.find().toArray()
      res.send(music)
    })

    app.get('/saved',async(req,res)=>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email:email}
      const result = await saveMusicCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/saved',async(req,res)=>{
      const item = req.body;
      const result = await saveMusicCollection.insertOne(item)
      res.send(result)
    })

    app.delete('/saved/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await saveMusicCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersMusicCollection.insertOne(user)
      res.send(result)
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })