// this is a routes file

import express from "express"
// make this route file use the controller file
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

// get access to the express router because we're going to be creating the different routes that people can go to
const router = express.Router()

// one demo route "/", it's going to get the restaurants API
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
// a route for a specific restaurant, with a specific ID, includes all info on that restaurant and all reviews
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById)
// returns a list of cuisines - because in the front end, the users should be able to select a cuisine from dropdown menu
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)

// set up routes for create/edit/delete reviews - need a Reviews Controller!
router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router