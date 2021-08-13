// Data Access Objects files that will allow the code to access restaurants

// create a variable to store a reference to our database.
let restaurants;

// contains a few methods that are async
export default class RestaurantsDAO {
  // a reference to our restaurants db
  static async injectDB(conn) {
    if (restaurants) {
      // if restaurants is already filled
      return
    }
    try {
      // otherwise try to connect to restaurants
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
    } catch (e) {
      // if cannot connect then this error message is displayed
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`,
      )
    }
  }

  // gets a list of restaurants in the db
  static async getRestaurant({
    // default options for results
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    // put together a query using the filters passed to getRestaurant (search)
    let query
    if (filters) {
      if ("name" in filters) {
        // queries are powerful in MongoDB. 
        // the $text command searches for any where in the text instead of something equal
        // how does it know which field to search for? - have to set up in MongoDB atlas
        query = { $text: { $search: filters["name"] } }
      } else if ("cuisine" in filters) {
        // database field "cuisine"
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let cursor

    try {
      // this finds all the restaurants from the db that go along with the query that we passed in (otherwise all restaurants)
      cursor = await restaurants
        .find(query)
    } catch (e) {
      // catches errors
      console.error(`Unable to issue find command, ${e}`)
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }

    // limit the results, skip to get the actual page number
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    try {
      // set the restaurants list to an array
      const restaurantsList = await displayCursor.toArray()
      // counts the documents in the query
      const totalNumRestaurants = await restaurants.countDocuments(query)

      return { restaurantsList, totalNumRestaurants }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      // if theres an error then return this
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }
  }
}