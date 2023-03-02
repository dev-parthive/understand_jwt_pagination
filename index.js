const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('colors')
const port = process.env.PORT ;

// middleware
app.use(cors())
app.use(express.json())

// middlewares 
app.use("*", (req, res, next)=> {
    console.log(`request recived ${req.method}  ${req.url}`)
    next()
})


/** 
 * API
 * route
 * /users (paginated)
 * /user/create
 * /login 
 * /register
 * /users (protected)
 * 
 * 
 * 
 */

// endpoints 

app.get("/test", (req, res) =>{
    console.log(`request recived ${req.method} ${req.url}`)
    res.json({
        message: "Hello world  ...."
    })

})

// connect mongodb 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `${process.env.DB_URL}`;
const client = new MongoClient(uri, { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 });
//  to always conenct with mongoDb you can do this 
/**
 * async function dbConnect(){
    try{
        client.connect()
        console.log("Database Conencted".blue)
    }
    catch(err){
        console.log(`${err.message}`.red)

    }
}
dbConnect()

 */

client.connect((err)=>{
    if(err){
        console.log(err)
        return;
    }
    else{
        //our databse is connected
        console.log("Database is connected".blue)
        const db = client.db("JWT")
        //ROUTES
        app.get('/users', async(req, res)=>{
            const users = await db.collection("userCollection").find().toArray()
            res.json({
                status: "success", 
                data: users
            })


        })
        // --------------user create ------------ 
        app.post('user/create', async(req,res) =>{
            const user = await db.collection('userCollection').insertOne({
                Name: "parthive boss", 
                email: "marbe ekhane las porbe sosane ", 
                password : "12341234"
            })
        })
    }
})




app.listen(port , ()=>{
    console.log(`server is running on port ${port}`.yellow)
    client.connect( (err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("mongodb is conencted")
        }
        // client.close()
        
    })
})