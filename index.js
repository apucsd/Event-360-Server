const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
// middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyjfh6u.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    const serviceCollection = client.db("event-360").collection("services");
    const eventCollection = client.db("event-360").collection("events");

    //services routes
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();

      return res.send({ result });
    });
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);

      res.status(200).send({ message: "Added service  successfully", result });
    });
    app.patch("/services/:id", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.findOneAndUpdate(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: service,
        },
        { new: true }
      );
      res.send({ result });
    });

    app.delete("/services/:id", async (req, res) => {
      const result = await serviceCollection.findOneAndDelete({
        _id: new ObjectId(req.params.id),
      });
      res.send({ result });
    });

    //events routes
    app.get("/events", async (req, res) => {
      const result = await eventCollection.find().toArray();

      return res.send({ result });
    });
    app.post("/events", async (req, res) => {
      const event = req.body;
      const result = await eventCollection.insertOne(event);

      res.status(200).send({ message: "Added event  successfully", result });
    });
    app.patch("/events/:id", async (req, res) => {
      const event = req.body;
      const result = await eventCollection.findOneAndUpdate(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: event,
        },
        { new: true }
      );
      res.send({ result });
    });
    app.delete("/events/:id", async (req, res) => {
      const result = await eventCollection.findOneAndDelete({
        _id: new ObjectId(req.params.id),
      });
      res.send({ result });
    });
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
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
