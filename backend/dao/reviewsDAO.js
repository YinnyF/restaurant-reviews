// Data Access Objects files that will allow the code to access reviews

// import mongodb to have access to ObjectId
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

// create a variable to store a reference to our database.
let reviews

// contains 4 async methods that 
export default class ReviewsDAO {
  // a reference to our reviews db
  static async injectDB(conn) {
    if (reviews) {
      // if reviews is already filled
      return
    }
    try {
      // otherwise try to connect to reviews
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = { name: user.name,
          user_id: user._id,
          date: date,
          text: review,
          // turn the restaurant id into a mongodb object id
          restaurant_id: ObjectId(restaurantId), }

      // insert it into the db
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  // takes the text of the review to update the review...
  static async updateReview(reviewId, userId, text, date) {
    try {
      const updateResponse = await reviews.updateOne(
        // look for the review with the right review id and correct user id
        { user_id: userId, _id: ObjectId(reviewId)},
        // sets the new text and new date
        { $set: { text: text, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId, userId) {

    try {
      // this looks for the correct review id and checks that the userid matches before deleting.
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

}