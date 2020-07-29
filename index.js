require('dotenv').config();

const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      fileUpload = require('express-fileupload')
    //   flash = require("connect-flash")
      ;

const sesionRoutes = require("./routes/sesion");
const adminRoutes = require("./routes/admin");


app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// app.use(flash());

// app.use(function(req, res, next){
//     // 
//     next();
// });

app.use(sesionRoutes);
app.use("/admin",adminRoutes);



app.listen(process.env.PORT || 3000, process.env.IP ,function(){
    console.log("Se ha iniciado un servidor en el puerto 3000");
});



//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