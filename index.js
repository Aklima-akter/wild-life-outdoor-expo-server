const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g47ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
console.log(uri)

async function run() {
  try {
    await client.connect()
    const database = client.db('wildLandsCompaing')
    const campingCollection = database.collection('campingName')

    // create a document to insert
    const name = {
      img: 'https://i.ibb.co/LCYjTsJ/classic-tent-1.jpg',
      title: 'CLASSIC TENTS',
      description:
        'At classical tents & party goods, the berkshires’ premier source for tent rentals, we are here to help make your event a success.',
    }
    const result = await campingCollection.insertOne(name)
    console.log(`A document was inserted with the _id: ${result.insertedId}`)
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
