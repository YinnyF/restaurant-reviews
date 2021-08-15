# restaurant-reviews

Practising MERN stack 🐳

🌸  lots of comments

🌸  step by step commits

🌸  just for fun

🌸  much debugging

## Technology

### Back End Server
* Express
* Node.js
* Database: MongoDB (no Mongoose library)
* DB Hosting: MongoDB Atlas
* Sample data: sample_restaurants MongoDB Atlas

## Usage

Clone this repo.

### Back End

Change directory into the back end: 
```
cd backend
```

Install dependencies (nodemon is installed globally): 
```
npm i
npm i -g nodemon
```

Set environment variables for the db in the backend folder, first create the .env file:
```
touch .env
```

Retrieve your MongoDB URI:
* Go to MongoDB Atlas > connect > connect your application
* Copy the URI
* Edit the URI so that `<password>` is replaced by your real MongoDB password
* Edit the URI so that `myFirstDatabase` is replaced by `sample_restaurants`

In the .env file, insert the below (copy your own URI as indicated):
```
RESTREVIEWS_DB_URI=YOUR_URI_HERE
RESTREVIEWS_NS=sample_restaurants
PORT=5000
```

To start server:
```
nodemon server
```

Then to view the data, go to:
```
http://localhost:5000/api/v1/restaurants
```
 