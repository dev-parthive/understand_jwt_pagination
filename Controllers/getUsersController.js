async function getAllUsers(req, res){
    try{
        // dbConnect()
        const users = await db.collection("userCollection").find().toArray()
        res.json({
            status: "success", 
            data: users
        })
       }
       catch(err){
        console.log(err)
        res.json({
            status: "unsuccess"
        })
       }
}

module.exports = {
    getAllUsers
}