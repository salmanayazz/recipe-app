var express = require('express');
var router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const { ObjectId } = require('bson');


const url = process.env.DATABASE;

const client = new MongoClient(url);

// test connection
(async function() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
})()

function formatIdToString(id) {
    return id.toString();
}

function formatIdToObj(id) {
    return new ObjectId(id);
}

router.get('/', async function(req, res, next) {
    try {
        console.log("get")
        await client.connect();
        const database = client.db("recipes");
        const collection = database.collection("recipe");
        const recipes = await collection.find({}).toArray();
        const recipesWithConvertedId = recipes.map((recipe) => ({
            ...recipe,
            _id: recipe._id.toString(),
        }));
        res.json(recipesWithConvertedId);
    } finally { 
        //await client.close(); TODO: seems to be crashing the server
    }
});

router.get('/:recipeID', function(req, res, next) {
    
 
});

router.post('/', async function(req, res, next) {
    try { 
        console.log(req.body)
        await client.connect();
        const database = client.db("recipes");
        const collection = database.collection("recipe")
        const result = await collection.insertOne(
            req.body 
        );
        res.json(await collection.find({}).toArray());
    } catch(error)  {
        res.status(500).json(result); // TODO: fix error
    } finally {
        await client.close();
    }
})

router.put('/:recipeID', async function(req, res, next) {
    try {
        console.log(req.body) 
        await client.connect();
        const database = client.db("recipes");
        const collection = database.collection("recipe");
        req.body._id = formatIdToObj(req.body._id);
        const result = await collection.replaceOne({ _id: req.body._id }, req.body);
        console.log(result);

        res.json(await collection.find({}).toArray());
    } catch(error) {
        res.status(500).json(error); // TODO: fix error
    } finally {
        await client.close();
    }
})

router.delete('/:recipeID', async function(req, res, next) {
    try {
        console.log(req);

        await client.connect();
        const database = client.db("recipes");
        const collection = database.collection("recipe");
        req.body._id = formatIdToObj(req.body._id);
        const result = await collection.deleteOne({ _id: formatIdToObj(req.params.recipeID) });
        res.json(await collection.find({}).toArray());
    } catch(error) {
        res.json(error); // TODO: fix error
    } finally {
        await client.close();
    }
})


module.exports = router; 