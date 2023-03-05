const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next){
    const token = req.header('Authorization')
/**
 * 1.Check for authentication token
 * 2.if token not found, return an unauth response 
 * 3. If found continue to the next() function 
 * 
 */

    if(!token){
        return res.status(401).send("Unauthenticated")
    }
    try{
        const user = jwt.verify(token, process.env.JWT_SECRET)
        console.log(user);
        req.user = user
        next()
    }
    catch(err){
        res.status(403).send("Invalid token")
    }
}