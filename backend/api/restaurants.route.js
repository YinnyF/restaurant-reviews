// this is a routes file

import express from "express"
// make this route file use the controller file
import RestaurantsCtrl from "./restaurants.controller.js"

// get access to the express router because we're going to be creating the different routes that people can go to
const router = express.Router()

// one demo route "/", it's going to get the restaurants API
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

export default router