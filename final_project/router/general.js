const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//axios.get('http://localhost:5000/')
//   .then(response => {
//       console.log("Book list: ", response.data);
//   })
//    .catch(error => {
//       console.error("Error getting the books: ", error.message);
//   })

const isbn = 3;

//axios.get(`http://localhost:5000/isbn/${isbn}`)
//    .then(response => {
//        console.log("Book details:", response.data);
//    })
//    .catch(error => {
//        console.error("Error getting the book:", error.message);
//    });

//const author = 'Jane Austen'; 

//axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
//  .then(response => {
//    console.log("Author's books:", response.data);
//  })
//  .catch(error => {
//    console.error("Error getting author's books:", error.message);
//  });

async function getBookByTitle(title) {
    try {
      const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
      console.log("Book found:\n", JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Book not found: ", error.message);
    }
  }
  
getBookByTitle("Pride and Prejudice");

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
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
