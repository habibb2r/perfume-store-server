const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ir3lm70.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const allProductsCollection = client
      .db("perfumeStore")
      .collection("perfumes");

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allProductsCollection.findOne(query);
      res.send(result);
    });

    app.get("/popular", async (req, res) => {
      const result = await allProductsCollection
        .find({ popular: true })
        .toArray();
      res.send(result);
    });
    app.get("/allProducts/:filter", async (req, res) => {
      const filter = req.params.filter || "All";
      let query = {};
      if (filter !== "All") {
        query = { type: filter };
      }

      const products = await allProductsCollection.find(query).toArray();

      res.send({
        results: products,
      });
    });

    // Featured collection
    app.get("/featured", async (req, res) => {
      const result = await allProductsCollection
        .find({ isFeatured: true })
        .toArray();
      res.send(result);
    });

    app.get("/allitems", async (req, res) => {
      const allItems = await allProductsCollection.find().toArray();
      res.send(allItems);
    });

    // // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Perfume Server Turned On");
});

app.listen(port, () => {
  console.log(`Perfume is Online on Port: ${port}`);
});
