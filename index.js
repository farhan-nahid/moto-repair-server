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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");


                                     /*
                                                         All Post APIS                    
                                                                                             
                                      */


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

    app.post('/add-order',(req,res)=>{
      orderCollection.insertOne(req.body)
      .then(result=>{
        res.send(result.insertedCount > 0)
      })
    })

    app.post('/add-admin', (req,res)=>{
      const newAdmin = req.body.email;
      adminsCollection.insertOne({email:newAdmin})
      .then(result =>{
        res.send(result.insertedCount > 0)
      })
    })


                                         /*
                                                         All Get APIS                    
                                                         
                                        */


    app.get('/all-services', (req, res)=>{
      serviceCollection.find()
      .toArray((err, services)=>{
        res.send( services);
      })
    })

    app.get('/all-services/:id', (req, res)=>{
      serviceCollection.find({_id:ObjectID(req.params.id)})
     .toArray((err, service)=>{
       res.send( service[0]);
     })
  })

    app.get('/all-review', (req, res) => {
      reviewCollection.find({})
       .toArray((err, reviews) => {
          res.send(reviews);
        })
    });

    app.get('/all-orders', (req, res) => {
      orderCollection.find({})
          .toArray((err, orders) => {
              res.send(orders);
          })
    });

    app.get('/orderedByEmail', (req, res)=>{
      orderCollection.find({email: req.query.email})
      .toArray((err, order)=>{
        res.send( order)
      })
    })

    app.get('/isAdmin', (req, res)=>{
      const email = req.query.email
      adminsCollection.find({email:email})
      .toArray((err, admins) => {
        res.send(admins.length > 0)
      })  
    })


    
                                         /*
                                                         All Delete APIS                    
                                                         
                                        */


    app.delete('/service-delete/:id', (req, res)=>{
      serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then( result =>{
        res.send(result.deletedCount > 0)
      })
    })

    app.delete('/cancel-order/:id', (req, res)=>{
      orderCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then( result =>{
        res.send(result.deletedCount > 0)
      })
    })


    
                                         /*
                                                         All Update APIS                    
                                                         
                                        */


    app.patch('/update-order-status', (req, res) => {
      const { id, status } = req.body;
      orderCollection.findOneAndUpdate(
          { _id: ObjectId(id) },
          {
              $set: { status },
          }
      ).then(result => res.send(result.lastErrorObject.updatedExisting))
  })


                                           /*
                                                         Finished All APIS                    
                                                         
                                         */

});

app.get('/', (req, res) => {
    res.send('Welcome to Moto Repair Server API');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })  