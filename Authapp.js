require('dotenv').config()
var express=require('express'),
    jwt=require('jsonwebtoken');


var app=express()
app.use(express.json())
let RefreshTokens=[]
app.post('/token',(req,res)=>{
    const RefreshToken=req.body.token
    if(RefreshToken==null) return res.sendStatus(401)
    if(!RefreshTokens.includes(RefreshToken)) res.sendStatus(403)
    jwt.verify(RefreshToken,process.env.Refresh_Token_secret,(err,user)=>{
        if(err) return res.sendStatus(403)
        const AccessToken=generateaccesstoken({name:user.name})
        res.json({AccessToken:AccessToken})
    })
})
app.delete('/logout',(req,res)=>{
    RefreshTokens=RefreshTokens.filter(token=>token!=req.body.token)
    res.sendStatus(204)
})
app.post('/login',(req,res)=>{
    const username=req.body.username;
    const user={name:username}
    const AccessToken=generateaccesstoken(user);
    const RefreshToken=jwt.sign(user,process.env.Refresh_Token_secret) 
    RefreshTokens.push(RefreshToken)
    res.json({AccessToken:AccessToken,RefreshToken:RefreshToken})
})
function generateaccesstoken(user){
    return jwt.sign(user,process.env.Access_Token_secret,{expiresIn:'10m'});
}
app.listen(4000,(req,res)=>{
    console.log("server running at 4000")
})

