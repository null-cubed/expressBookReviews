const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username=req.query.username;
  const password=req.query.password;
  if(!username||!password){
    return res.status(404).json({error:"Missing username or password"});
  }
  if(isValid(username)){
    users.push({username,password});
    return res.status(200).json({msg:"User successfully registered"});
  }
  return res.status(208).json({error:"Username taken or invalid"});
});

// Get the book list available in the shop
function getBooks(){
  return new Promise((r)=>{
    r(books);
  });
}

public_users.get('/',function (req, res) {
  getBooks().then((books)=>{
    res.status(200).json(books);
  },(error)=>{
    res.status(500).json({error});
  });
});

// Get book details based on ISBN
function getBook(isbn){
  return new Promise((rs,rj)=>{
    if(!books[isbn])rj("No such book under isbn");
    else rs(books[isbn]);
  });
}

public_users.get('/isbn/:isbn',function (req, res) {
  getBook(req.params.isbn).then((book)=>{
    res.status(200).json(book);
  },(error)=>{
    res.status(404).json({error});
  });
 });
  
// Get book details based on author
function getBooksByAuthor(author){
  return new Promise((r)=>{
    var matches=[];
    Object.keys(books).forEach((n)=>{
      if(books[n].author===author)matches.push(books[n]);
    });
    r(matches);
  });
}

public_users.get('/author/:author',function (req, res) {
  getBooksByAuthor(req.params.author).then((books)=>{
    res.status(200).json(books);
  },(error)=>{
    res.status(500).json({error});
  });
});

// Get all books based on title
function getBooksByTitle(title){
  return new Promise((r)=>{
    matches=[];
    Object.keys(books).forEach((n)=>{
      if(books[n].title===title)matches.push(books[n]);
    });
    r(matches);
  });
}

public_users.get('/title/:title',function (req, res) {
  getBooksByTitle(req.params.title).then((books)=>{
    res.status(200).json(books);
  },(error)=>{
    res.status(500).json({error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if(books[req.params.isbn]){
    return res.status(200).json(books[req.params.isbn].reviews);
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
