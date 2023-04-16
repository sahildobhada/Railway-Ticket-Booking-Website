const express=require("express");
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const ejs=require("ejs")
const bcrypt=require("bcrypt")
const saltrounds=10;

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');

const url="mongodb+srv://sahil_Dobhada:sahil30102001@cluster0.nnqiyhy.mongodb.net/BookYourTicket?retryWrites=true&w=majority"

const travelshema=new mongoose.Schema({
    currentlocation:String,
    destination:String,
    date:String,
    Travellingpersoncount:Number
})
const Destinationdata=mongoose.model("Destinationdata",travelshema)
const schema=new mongoose.Schema({
    station:String,
    source:String,
    destination:String,
    sourcetime:String,
    destinationtime:String
})

const persondataschema=new mongoose.Schema({
    username:String,
    password:String
})
const personaldata=new mongoose.model("persondata",persondataschema);
mongoose.connect(url).then(()=>{
    console.log("DataBase connected");
})
const tejasrajexp=mongoose.model("tejasrajexp",schema)
const duronto=mongoose.model("duronto",schema)
const shalimar=mongoose.model("shalimarExpress",schema);

var train=[tejasrajexp,duronto,shalimar]

var trainname=["Tejas Raj Express","Duronto","Shalimar Express"]

var numberoftraveller=0;
var userregister="";
app.get("/",function(req,res){
    res.render('entry')
})
app.get("/register",function(req,res){
    res.render('register')
})
app.get("/login",function(req,res){
    res.render('login')
})

app.post("/register",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    userregister=username;
    bcrypt.hash(password,saltrounds,async function(err,hash){
        if(!err){
            const p1=new personaldata({
                username:username,
                password:hash
            })
            const p=await personaldata.findOne({username:username}).exec()
            if(!p){
                p1.save()
                res.render('index')
            }else{
                res.render('login')
            }
        }
    })
})
app.post("/login",async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const p=await personaldata.findOne({username:username}).exec()
    if(p){

    bcrypt.compare(password, p.password, function(err, result) {
        // result == true
        if(result){
            res.render('index')
        }else{
            res.send('<h1>Enter correct password</h1>')
        }
    });
}

})
app.post("/destinationdata",async function(req,res){
 const source=req.body.currentlocation;
 const destination=req.body.destination;
 const date=req.body.datevalue
 const ntp=req.body.numberoftravellingperson;
 numberoftraveller=ntp;
 const d=new Destinationdata({
    currentlocation:source,
    destination:destination,
    date:date,
    Travellingpersoncount:ntp
 })
 d.save()
 const traindetail=[]
 for(let i=0;i<train.length;i++){
 const obj1=await train[i].findOne({source:source}).exec();
 const obj2=await train[i].findOne({source:destination}).exec()

 if(obj1 && obj2){
    console.log("In TicketBooking")
    traindetail.push({train:trainname[i],station:obj1.station,sourceTime:obj1.sourcetime,destinationtime:obj1.destinationtime,ds:obj2.station})
    console.log(traindetail)
    console.log({train:trainname[i],station:obj1.station,sourceTime:obj1.sourcetime,destinationtime:obj2.destinationtime,ds:obj2.station});
    res.render("TicketBooking",{source:source,Destination:destination,train:traindetail})
 }
}
if(traindetail==[]){
    res.redirect('/');
}
  
})

app.post("/TicketBill",function(req,res){
    console.log(req.body.info);
    const info=req.body.info;
    const infosplit=[]
    var str=""
    for(let i=0;i<info.length;i++){
        if(info[i]==','){
            infosplit.push(str)
            str="";
            continue;
        }
        str+=info[i]
    }
    infosplit.push(str);
    console.log("size "+ infosplit);
    var value=Math.floor(Math.random()*1000);
    var seatnumber=[]
    for(let i=1;i<=numberoftraveller;i++){
        seatnumber.push(value);
        value+=1;
    }
    res.render("TicketBill",{name:userregister,departurestation:infosplit[0],arrivalstation:infosplit[1],departuretime:infosplit[2],arrivaltime:infosplit[3],seatnumber:seatnumber,price:100*numberoftraveller});
})


app.listen(process.env.port || 3000)