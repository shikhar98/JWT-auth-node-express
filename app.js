require('dotenv').config()
var express=require('express'),
    jwt=require('jsonwebtoken');


const posts=[
    {
        username:'Shikhar',
        title:'Post 1'
    },
    {
        username:'Rishi',
        title:'Post 2'
    }

]
var app=express()
app.use(express.json())
app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.username===req.user.name)) 
});
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(token==null) return res.sendStatus(401)
    jwt.verify(token,process.env.Access_Token_Secret,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next() 
    })
}
app.listen(3000,(req,res)=>{
    console.log("server running at 3000")
})

