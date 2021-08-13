// allows us access the functions that allow us to access the db in this file.
import RestaurantsDAO from "../dao/restaurantsDAO.js"

// restaurants controller class with a few methods inside
export default class RestaurantsController {
  // called through a url, can be passed a query string (? with a key-value pair)
  static async apiGetRestaurants(req, res, next) {
    // can set the variable equal to whatever value is passed as a query in the URL.
    // check if it exists, then convert it to an int, otherwise default to 20.
    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
    // repeat the same thing with the page number
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    // repeat with filters, start off with an empty object.
    let filters = {}
    // if see cuisine query string, then set that value to the filters.cuisine variable
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    // as above etc.
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    // call getRestaurants to get a list of restaurants in the db.
    // It's going to return a restaurants list and the total number of restaurants.
    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
      // these are the parameters
      filters,
      page,
      restaurantsPerPage,
    })

    // create a response
    let response = {
      // these are the responses
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    // send a json response with all this info to whoever called this URL.
    res.json(response)
  }
}
