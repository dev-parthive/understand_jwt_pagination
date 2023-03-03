const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('colors')
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken')


// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

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
const { urlencoded } = require('express')
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
           try{
            const users = await db.collection("userCollection").find().toArray()
            res.json({
                status: "success", 
                data: users
            })
           }
           catch(err){
            console.log(err)
            res.send({
                status: "unsuccess"
            })
           }


        })
        // --------------user create ------------ 
        app.post('/user/create', async(req,res) =>{
          try{
            const user = await db.collection('userCollection').insertOne({
                Name: "parthive boss", 
                email: "marbe ekhane las porbe sosane ", 
                password : "12341234"
            })
            res.send({
                status: "success", 
                data: user
            })
          }
          catch(err){
            console.log(err)
            res.send({
                status: "unsucess"
            })

          }
        })

        // ----- register --------- 
        app.post("/register",  async(req, res)=>{
            try{
                const {name, email, password} = req.body
                // console.log(req.body)
                if(!name || !email || !password){
                    return res.send({
                        status: "error", 
                        message: "please provide all the values"
                    })
                }
                 const user = await db.collection("userCollection").insertOne({
                    name,
                    email,
                    password
                 })
                 res.send({
                    status: "success", 
                    data : user
                 })
            }
            catch(err){
                console.log(err)
                res.send({
                    status: "error"
                })
            }

        })

        // ----- login ------ 
        app.post("/login", async(req, res)=>{
            try{
                const {email, password } = req.body;
                console.log(email, password);
                if(!email || !password){
                    return res.send({
                        status: "error", 
                        message: "please provide all the values"
                    })
                }
                const usersCollection = db.collection('userCollection')
                const user = await usersCollection.findOne({
                    email, 
                    password
                })
                // this part will be execute if user not find 
                
                if(!user){
                    console.log("no user found");
                    return res.send({
                        status: "error", 
                        message: "Invalid Credantials"
                    })
                }



                /**
                 * validate body
                 * find the user 
                 * if suer nto found , send invalid error response
                 * user found
                 * create token 
                 * send response
                 */
                delete user.password
                console.log(user)
                const token = jwt.sign( {data: user} ,process.env.JWT_SECRET , {expiresIn: '24h'})
                console.log(token);
                    res.send({
                        status: "success", 
                        data : user, 
                        token: token
        
                    })
            }
            catch(err){
                console.log(err)
                res.send({
                    status: "error"
                })
            }
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