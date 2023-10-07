const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
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

    app.get('/',(req,res)=>{
      res.send('listen a song')
    })

    app.get('/music',async(req,res)=>{
      const music = await musicCollection.find().toArray()
      res.send(music)
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