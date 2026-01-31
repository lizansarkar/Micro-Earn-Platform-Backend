require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@lizan0.tl45evy.mongodb.net/?appName=lizan0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("microEarn");
    const usersCollection = db.collection("users");

    // aijaygay register component theke user ke add koracchi
    app.post("/users", async (req, res) => {
      const user = req.body;

      // চেক করুন ইউজার আগে থেকে আছে কি না
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      // নতুন ইউজার ডাটাবেসে সেভ করা (কয়েন সহ)
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //ai jayga theke user er data niye asbo login er jonno
    // ইমেইল দিয়ে সিঙ্গেল ইউজার ডাটা খোঁজা
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // backend/index.js (উদাহরণ)
    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      // নিশ্চিত করুন যে আপনি অবজেক্টের ভেতর role টা পাঠাচ্ছেন
      res.send({ role: user?.role });
    });

    console.log("MongoDB Connected Successfully!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Server is running..."));
app.listen(port, () => console.log(`Listening on port ${port}`));
