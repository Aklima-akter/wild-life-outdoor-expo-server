const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g47ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
// console.log(uri)

async function run() {
  try {
    await client.connect()
    const database = client.db('wildLandsCompaing')
    const campingCollection = database.collection('campingName')
    const orderCollection = database.collection('myOrder')
    console.log('connect to the database')

    //GET API
    app.get('/addCamping', async (req, res) => {
      const cursor = campingCollection.find({})
      const camping = await cursor.toArray()
      res.send(camping)
    })
    app.get('/allOrder', async (req, res) => {
      const cursor = orderCollection.find({})
      const camping = await cursor.toArray()
      res.send(camping)
    })

    app.get('/addCamping/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const camp = await campingCollection.findOne(query)
      res.send(camp)
    })

    app.get('/allOrder/:email', async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray()
      res.send(result)
    })

    //POST API
    app.post('/allOrder', async (req, res) => {
      const addOrder = req.body
      const result = await orderCollection.insertOne(addOrder)
      console.log(`A document was inserted with the _id: ${result.insertedId}`)
      res.send(result)
    })
    //POST API
    app.post('/addCamping', async (req, res) => {
      const newCamping = req.body
      const result = await campingCollection.insertOne(newCamping)
      console.log(`A document was inserted with the _id: ${result.insertedId}`)
      res.send(result)
    })

    //POST API
    app.post('/myOrder', async (req, res) => {
      const booking = req.body
      const result = await orderCollection.insertOne(booking)
      res.send(result)
    })

    //Update API
    app.put('/allOrder/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          status: 'Approved',
        },
      }
      const result = await orderCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })

    //DELETE API
    app.delete('/allOrder/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      console.log('deleting user with id', result)
      res.send(result)
    })
  } finally {
    // await client.close()
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('wow my server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
