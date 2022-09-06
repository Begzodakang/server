const express = require("express")
const exphbs = require("express-handlebars")
const connection = require("./utils/connectDB")
const session = require("./utils/session")
const path = require("path")
const dotenv = require("dotenv")
dotenv.config()
const router = require("./router/router")


connection()

const app = express()
app.use(express.static("public"))
app.use(session)
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.engine("hbs" , exphbs.engine({extname:"hbs"}))
app.set("view engine" , "hbs")
app.set("views" , "views")



app.use("/" , router)

const PORT = process.env.PORT||3000
app.listen( PORT, ()=>{console.log("Server running on port " , PORT);})




