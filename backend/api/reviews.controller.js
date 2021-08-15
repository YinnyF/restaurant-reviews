// import reviews data - To be created!
import ReviewsDAO from "../dao/reviewsDAO.js"

// this reviews controller contains 3 methods - one that posts, updates, and deletes.
export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      // getting information from the request body instead of query like before. 
      const restaurantId = req.body.restaurant_id
      // getting the text from from the request body - (later we will see how to send this info through the body)
      const review = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      // this sends the data to the database with addReview.
      const ReviewResponse = await ReviewsDAO.addReview(
        // info to send to the db
        restaurantId,
        userInfo,
        review,
        date,
      )
      res.json({ status: "success" })
    } catch (e) {
      // error message if it doesnt work
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id
      const text = req.body.text
      const date = new Date()

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date,
      )

      var { error } = reviewResponse
      if (error) {
        res.status(400).json({ error })
      }

      // this conditional checks that the review was not updated
      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      // note that this is a query parameter in the url
      const reviewId = req.query.id
      // non standard to get info from the body - this is a simple version of authentication 
      // (in production this is more complex)
      const userId = req.body.user_id
      console.log(reviewId)
      // call deleteReview and send over the reviewId and userId
      const reviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}
