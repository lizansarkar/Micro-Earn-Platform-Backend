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
    const db = client.db();
    const usersCollection = db.collection("users");

    app.post("/users", async (req, res) => {
      const user = req.body;

      // চেক করুন ইউজার আগে থেকেই আছে কিনা (Upsert style)
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    console.log("MongoDB Connected Successfully!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send("Server is running..."));
app.listen(port, () => console.log(`Listening on port ${port}`));
