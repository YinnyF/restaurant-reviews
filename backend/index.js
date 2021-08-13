// in this file we connect to the db and start the server

import app from "./server.js"
import mongodb from "mongodb"
// allows us to access the env variables.
import dotenv from "dotenv"
// allows us access the functions that allow us to access the db in this file.
import RestaurantsDAO from "./dao/restaurantsDAO.js"

//configure dotenv - load in env variables
dotenv.config()
// access our MongoClient from mongodb
const MongoClient = mongodb.MongoClient

// create our port number, to access the env variable we use this syntax! If cannot be accessed then default to 8000.
const port = process.env.PORT || 8000

// connect to the db
MongoClient.connect(
  // pass in the db URI
  process.env.RESTREVIEWS_DB_URI,
  // pass in the options for accessing the db e.g. limit people connected to the db and timeout.
  { 
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    // mongodb node.js driver rewrote the tool that it uses to parse mongodb connection strings
    // because the specifics have changed, they put the new connection string parser behind a flag.
    useNewUrlParser: true 
  }
)
// catch errors
.catch(err => {
  // log the error
  console.error(err.stack)
  // exit the process
  process.exit(1)
})
// after we have connected to the db and checked for errors - now we can do something! 
.then(async client => {
  // before start server call the injectDB async function, this is how we get our initial reference to the restaurants collection in the db.
  await RestaurantsDAO.injectDB(client)
  // this is how we start our webserver
  app.listen(port, () => {
    // log that we are listening on the port
    console.log(`listening on port ${port}`)
  })
})
