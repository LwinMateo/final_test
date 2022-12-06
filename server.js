
var express = require("express");
var app = express();
var final = require("./final.js");
var path = require("path");

const https = require("https");

//const certificate_folder = "./certs/";


app.use(express.json());
app.use(express.urlencoded({extended: true}));



var HTTP_PORT = process.env.PORT || 8080;
function onHttpStart() 
{
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "finalViews/home.html"));
});

app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, "finalViews/register.html"));
});

app.post('/register', (req, res)=>{
    final.register(req.body.user).then(function(data_user){
        var txt = `<p>${req.body.user} registerd successfully</p><br><p><a href="/home.html">Go Home</a></p>`;
        res.send(txt);
    }).catch((err)=>{
        res.send(err);
    });
});

app.get('/signIn', (req, res)=>{
    res.sendFile(path.join(__dirname, 'finalViews/signIn.html'));
});

app.post('/signIn', (req, res)=>{
    final.signIn(req.body.email).then(function(data){
        var txt = `<p>${req.body.user} signed in successfully</p><br><p><a href="/home.html">Go Home</a></p>`;
        res.send(txt);
    }).catch((err)=>{
        res.send(err);
    });
});




app.get("*", (req, res)=>{
    res.status(404).send("Error 404: page not found.")
});

final.startDB().then((data)=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log(err);
});