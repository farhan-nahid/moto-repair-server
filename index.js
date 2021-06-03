const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const { ObjectID, ObjectId } = require('bson');
const app = express()
require('dotenv').config();


const port = process.env.PORT ||  5000;

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xoju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");

    app.post('/add-services', (req,res)=>{
      const newService = req.body;
      serviceCollection.insertOne(newService)
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
    })

    app.post('/add-review', (req,res)=>{
      const newReview = req.body;
      reviewCollection.insertOne({name:newReview.name, address:newReview.address, description:newReview.description,img:newReview.img, star:newReview.star})
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/all-services', (req, res)=>{
      serviceCollection.find()
      .toArray((err, services)=>{
        res.send( services);
      })
    })

    app.get('/all-review', (req, res) => {
      reviewCollection.find({})
          .toArray((err, reviews) => {
              res.send(reviews);
          })
      });





});

app.get('/', (req, res) => {
    res.send('Welcome to Moto Repair Server API');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })  