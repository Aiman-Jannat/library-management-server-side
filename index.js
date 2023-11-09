const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT||5000;
const cors = require('cors');
app.use(express.json());
app.use(cors({
  origin:"https://assignment-eleven-client-ed14d.web.app",
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})



const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )}
require('dotenv').config();




//middleware







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzvbxiw.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("libraryDB");
    const allBooksCollection = database.collection("allBooks");
    const categoriesCollection = database.collection("categories")
    const borrowedBooksCollection = database.collection("borrowedBooks")
    // Send a ping to confirm a successful connection
    app.put('/books/:id', async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      const filter={_id:new ObjectId(id)};
      const options={
        upsert:true
      }
      const updatedUser={
        $set:{
          name:user.name,
          image:user.image,
          author:user.author,
          rating:user.rating,
          category:user.category,
          quantity:user.quantityy
          
  
        }
      }
      const result = await allBooksCollection.updateOne(filter, updatedUser,options);
      
      res.send(result);
      })
    
      
      app.post('/borrowed', async(req, res)=>{
        const user = req.body;
        const result = await borrowedBooksCollection.insertOne(user);
        res.send(result);
        
      
      
      })
      app.post('/books', async(req, res)=>{
        const user = req.body;
        console.log("user",user)
        const result = await allBooksCollection.insertOne(user);
        res.send(result);
        
      
      
      })


      app.get('/books',async(req,res)=>{
        console.log(req.query.category);
        let query = {};
        if(req.query?.category)
        {
          query = {category:req.query.category}
        }
        const result = await allBooksCollection.find(query).toArray();
        res.send(result);
        
      })
      app.get('/borrowed',async(req,res)=>{
        // console.log(req.query.email);
        let query = {};
        if(req.query?.email)
        {
          query = {email:req.query.email}
        }
        console.log(query)
        const resultt = await borrowedBooksCollection.find(query).toArray();
        
        res.send(resultt);
        
      })
      

    app.get('/books',async(req,res)=>{
      console.log(req.query)
      const cursor = allBooksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/categories',async(req,res)=>{
        const cursor = categoriesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    // app.get('/books/:category',async(req,res)=>{
    //   console.log(category)
    //   const query = {category:category}
    //   const user = await allBooksCollection.findMany(query);
      
    //   res.send(user);
    //  })
    
     app.get('/categories/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:new ObjectId(id)}
      const user = await categoriesCollection .findOne(query);
      res.send(user);
     })
     app.delete('/borrowed/:id', async(req, res)=>{

      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await borrowedBooksCollection.deleteOne(query);
      res.send(result);
      
     })
    app.get('/books/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id:new ObjectId(id)}
      const user = await allBooksCollection.findOne(query);
      
      res.send(user);
     })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("library is runnning")
})
app.listen(port,()=>{
console.log("library");
})
