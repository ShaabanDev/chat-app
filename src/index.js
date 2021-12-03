// import express
const express = require('express');
// import path module to help defining the public folder path
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

const pubPath = path.join(__dirname,'../public')
app.use(express.static(pubPath))

app.get('/',(req,res)=>{
    res.render();
});


app.listen(process.env.PORT,()=>{
    console.log('server is on port '+process.env.PORT);
})

