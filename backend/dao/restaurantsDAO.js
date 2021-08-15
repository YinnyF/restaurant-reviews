// Data Access Objects files that will allow the code to access restaurants

// import mongodb to have access to ObjectId
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

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
  static async getRestaurants({
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

  // get reviews from one collection and put it into the restaurant
  static async getRestaurantByID(id) {
    try {
      // create a pipeline that matches the restaurants & review collections together
      const pipeline = [
        {
          // first matches the id of a certain restaurant
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  // second, look up some other items (reviews) to add to the result
                  // part of the mongodb aggregation pipeline
                  $lookup: {
                      // from reviews...
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      // create this pipeline thats going to...
                      pipeline: [
                          {
                              // match the restaurant id (find all the reviews that match that restaurant id)...
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      // set the results to be 'reviews'...
                      as: "reviews",
                  },
              },
              {
                  // add a field called reviews thats going to be a new thing in results...
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]

      // collect everything and return it
      return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      // get all distict cuisines
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}
