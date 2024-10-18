const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require('cors');
const bodyParser = require("body-parser");
dotenv.config()


const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(bodyParser.json())
routes(app);


mongoose.connect(`${process.env.MONGO_DB}`)
.then(()=> {
    console.log('Conect DB success')
})
.catch((err) =>{
    console.log(err)
})


app.listen(port, ()=>{
    console.log('Sever is running in port', + port)
}) 