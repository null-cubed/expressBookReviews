const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !users.includes(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.includes(username)&&users[username]===password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.query.username;
  const password=req.query.password;

  if(!username||!password)return res.status(403).json({error:"Missing username or password"});

  login=false;
  users.forEach((user)=>{
    if(user.username===username&&user.password===password)login=true;
  });

  if(login){
    let token=jwt.sign({data:password},"access",{expiresIn:3600});
    req.session.authorization={token,username};
    return res.status(200).json({message:"User successfully authenticated"});
  }
  return res.status(208).json({message:"Incorrect username or password"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn=req.params.isbn;
  username=req.session.authorization.username;
  if(!req.query.review)return res.status(400).json({error:"Missing review data"});
  if(!books[isbn])return res.status(404).json({error:"No such book under isbn"});
  books[isbn].reviews[username]={review:req.query.review};
  return res.status(200).send("Review added or updated successfully");
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  isbn=req.params.isbn;
  username=req.session.authorization.username;
  if(!books[isbn])return res.status(404).json({error:"No such book under isbn"});
  if(!books[isbn].reviews[username])return res.status(404).json({error:"No review under isbn for user"});
  delete books[isbn].reviews[username];
  return res.status(200).send("Successfully deleted review");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
