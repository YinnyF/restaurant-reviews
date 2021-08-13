// this is a routes file

import express from "express"

// get access to the express router because we're going to be creating the different routes that people can go to
const router = express.Router()

// one demo route "/", it's going to respond with hello world.
router.route("/").get((req, res) => res.send("hello world"))

export default router