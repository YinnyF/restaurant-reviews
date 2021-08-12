// this file configures the express server.

// webserver
import express from "express"
// for cross origin resource sharing
import cors from "cors"
// routes are going to be in a separate file!
import restaurants from "./api/restaurants.route.js"

// this makes our server
const app = express()

// middleware - express is going to use this cors module.
app.use(cors())
// body parser(?) now depreciated, it's now included in express. 
// our server can now accept JSON in the body of a request
// i.e. if someone sends a GET/POST request to the server, it will be able to read JSON.
app.use(express.json())

// specify the initial routes - although they will be in a diff file.
// naming convention (begins with /api/) and then name of API (restaurants)
// localhost:3000/api/v1/restaurants
// second parameter is the folder where the routes are going to be.
app.use("/api/v1/restaurants", restaurants)
// undefined route and what it returns. 
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

// need to export app as a module
// then we'll be able to import this module in the file that accesses the db (file that runs the server)
// want to separate server code from db code
export default app 
