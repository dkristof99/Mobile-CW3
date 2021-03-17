const express = require("express");
const app = express()


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dkristof:1234@cluster0.wkaio.mongodb.net/CW3?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.use(express.json())

//Allows cross-origin access
app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Allow all methods
    res.header('Access-Control-Allow-Methods', "*");
    //allow different header fields
    res.header("Access-Control-Allow-Headers", "*");
});

//Logger - middleware that outputs all requests to the server console
app.use(function (req, res, next) {
    console.log("Request method: " + req.method);
    next();
});

//Get the MongoDB collection name
app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

app.get("/", (req, res, next) => {
    res.send("Select a collection, e.g., /collection/:collectionName")
})

app.get("/collection/", (req, res, next) => {
    res.send("Select a collection, e.g., /collection/lessons")
})

app.get("/collection/:collectionName", (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})


//Get an object based on ID
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne(
        { _id: new ObjectID(req.params.id) },
        (e, result) => {
            if (e) return next(e)
            res.send(result)
        }
    )
})

//Delete an object based on ID
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        { _id: new ObjectID(req.params.id) },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        }
    )
})

//Add a new object
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

//Update an object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi:false},
        (e, result) => {
            if (e) return next(e);
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error'})
        })
})



const port = process.env.PORT || 3000
app.listen(port)