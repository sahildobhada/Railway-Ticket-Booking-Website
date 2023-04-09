const express=require("express");
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const ejs=require("ejs")

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

app.get("/",function(req,res){
    res.render('index')
})












app.listen(process.env.port || 3000)