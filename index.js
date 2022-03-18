const express = require('express')
const dbConnection = require('./config/db')

require("dotenv").config()

const userRoutes = require("./src/users/Routes/userRoutes")
const adminRoutes = require("./src/users/Routes/adminRoutes")
const postRoutes = require("./src/posts/Routes/post.routes")


const app = express()
const port = 5000


app.use(express.json());

dbConnection()



app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => res.send('Hello World!'))


app.use(userRoutes, adminRoutes, postRoutes)






app.listen(port, () => console.log(`Example app listening on port ${port}!`))