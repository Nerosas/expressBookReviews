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
regd_users.put("/customer/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.body.username;
    let book = JSON.parse(public_users.get(`/isbn/${isbn}`));
    let preExistingBookReview = book.reviews.filter((user) => {
        return (book.reviews.user === user);
    })

    if (preExistingBookReview.length > 0) {
        book.reviews.filter((review) => {
            return (review != preExistingBookReview[0]);
        })
    }

    book.reviews.push({"user":user, "review":review});

    books.filter((old_books) => {
        return (old_books != book);
    })

    books.push(book);

    return res.status(200).json({message:"Review successfully added/modified"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;