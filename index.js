const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.h54g5oh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const kidsZoneCollection = client
      .db("kidsZoneProduct")
      .collection("products");
    // upload product
    app.post("/upload", async (req, res) => {
      const data = req.body;
      const result = await kidsZoneCollection.insertOne(data);
      res.send(result);
    });
    // get all products
    app.get("/products", async (req, res) => {
      const result = await kidsZoneCollection.find().toArray();
      res.send(result);
    });
    // get product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await kidsZoneCollection.findOne(query);
      res.send(result);
    });
    // get user by email
    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await kidsZoneCollection.find(query).toArray();
      res.send(result);
    });
    // update product
    app.patch("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const updateDoc = {
        $set: {
          price: data.price,
          quantity: data.quantity,
          description: data.description,
        },
      };
      const result = await kidsZoneCollection.updateOne(query, updateDoc);
      res.send(result);
    });
    // delete product by id
    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await kidsZoneCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("kidsZone is running...............");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
