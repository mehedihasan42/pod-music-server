const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
// app.use(express.static("dist"))

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.watftgx.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsrgles.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    await client.connect();

    const musicCollection = client.db("pod-music").collection("music");  //convert musics to music before give it production
    const saveMusicCollection = client.db("pod-music").collection("saved");
    const usersMusicCollection = client.db("pod-music").collection("users");

    
    app.get('/',async(req,res)=>{
      const result = "hello world";
      res.send(result)
    })

    app.get('/api/music',async(req,res)=>{
      const music = await musicCollection.find().toArray()
      res.send(music)
    })

    app.post('/api/music',async (req, res) => {
      const newItem = req.body;
      const result = await musicCollection.insertOne(newItem)
      res.send(result)
    })

    app.put('/api/music/:id',async(req,res)=>{
        const id = req.params.id;
        const {title,singer,lyricist,composer,label,Distributor,ISRC,UPC,CopR,Year,Link} = req.body;
        const filter = {_id: new ObjectId(id)};
        const updateDoc = {
          $set:{
            title:title,
            singer:singer,
            lyricist:lyricist,
            composer:composer,
            label:label,
            Distributor:Distributor,
            ISRC:ISRC,
            UPC:UPC,
            CopR:CopR,
            Year:Year,
            Link:Link,
          }
        }
        const result = await musicCollection.updateMany(filter,updateDoc)
        res.send(result)
    })

    app.delete('/api/music/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await musicCollection.deleteOne(query);
      res.send(result)
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

    app.get("/api/users",async(req,res)=>{
        const result = await usersMusicCollection.find().toArray();
        res.send(result)
    })

    app.post('/api/users',async(req,res)=>{
      const user = req.body;
      const query = {email:user.email}
      const existingUser = await usersMusicCollection.findOne(query)
      if(existingUser){
        return res.send({message: 'user already exit'})
      }
      const result = await usersMusicCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/api/users/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const updateDoc = {
        $set :{
          role:'admin'
        }
      }
      const result = await usersMusicCollection.updateOne(filter,updateDoc)
      res.send(result)
    })

    app.patch('/approve/users/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const updateDoc={
        $set:{
          role:'approve'
        }
      }
      const result = await usersMusicCollection.updateOne(filter,updateDoc)
      res.send(result)
    })

    app.delete("/api/users/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const result = await usersMusicCollection.deleteOne(filter)
      res.send(result)
  })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })