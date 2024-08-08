var express= require('express');
var app=express();

let server = require('./server');
let middleware=require('./middleware');

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalManagement';
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
           if(err) return console.log(err);
        db=client.db(dbName);
        app.get("/",(req,res)=>{
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
    });
});

//Displaying hospital details
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Displaying Details from Hospital Collection")
    var data=db.collection('hospital').find().toArray().then((doc)=>{res.json(doc)});
});

//Displaying ventilator details
app.get('/ventilatordetails',middleware.checkToken,function(req,res){
        console.log("Displaying Details from ventilator Collection")
        var data=db.collection('ventilator').find().toArray().then((doc)=>{res.json(doc)});
});

//seraching ventilator by status
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
        var status =req.body.status;
        console.log(status);
        var ventilatordetails=db.collection('ventilator').find({"status":status}).toArray().then(doc=>res.json(doc));
});

//seraching ventilator by Hospital name
app.post('/searchventbyhname',middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var hospitaldetails=db.collection('ventilator').find({"name":new RegExp(name,'i')}).toArray().then(doc=>res.json(doc));
});

//seraching hospital by Hospital name
app.post('/searchhosbyhname',middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital').find({"name":new RegExp(name,'i')}).toArray().then(doc=>res.json(doc));
});

//Update Ventilator details
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ vid : req.body.vid};
    console.log(ventid);
    var newval={$set:{status:req.body.status}};
    db.collection('ventilator').updateOne(ventid,newval,function(err,result){
        res.json('1 document updated');
        if(err) throw err;
        console.log("1 document updated")
    });
});

//Add Ventilator 
app.post('/addventilator',middleware.checkToken,(req,res)=>{
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status=req.body.status;
    var name=req.body.name;
    var item={hid:hid,vid:vid,status:status,name:name};
    db.collection('ventilator').insertOne(item,function(err,result){
        res.json('ventilator added');
        console.log("ventilator added");
    });
});

//Delete ventilator
app.delete('/deleteventilator',middleware.checkToken,(req,res)=>{      
    var item=req.body.vid;
    console.log(item);
    db.collection('ventilator').deleteOne({vid:item},(err,result)=>{
        res.json("ventilator deleted Succesfully");
    if(err) throw err;
    });
});
app.listen(2001);
