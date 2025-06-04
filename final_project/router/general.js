const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found'});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const authorQuery = req.params.author.toLowerCase();
    const result = [];
    
    for (let key in books) {
        if (books[key].author.toLowerCase() === authorQuery) {
        result.push({ id: key, ...books[key] });
        }
    }
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: 'No books have been found for the specified author' });
    }
});
      

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const titleQuery = req.params.title.toLowerCase();
    const result = [];
    
    for (let key in books) {
        if (books[key].title.toLowerCase() === titleQuery) {
        result.push({ id: key, ...books[key] });
        }
    }
    
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: 'No books have been found for the specified title' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const review = book.reviews;

    if (book) {
        res.json(review);
    } else {
        res.status(404).json({ message: 'Book not found'});
    }
});

module.exports.general = public_users;
