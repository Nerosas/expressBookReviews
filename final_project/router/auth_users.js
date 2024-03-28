const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return (userswithsamename.length === 0);
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return (validusers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message:"Error logging in."});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).json({message:"User successfully logged in."});
  } else {
    return res.status(208).json({message:"Invalid login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.body.username;
    let book = JSON.parse(public_users.get(`/isbn/${isbn}`));
    
    for (const {username, bookReview} in Object.entries(book.reviews)) {
        if (user === username) {
            bookReview = review;
            //todo: this would would better in a filter function.
            //Filter to check if the username is there, if so, modify.
            //If not, add a review.
        }
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
