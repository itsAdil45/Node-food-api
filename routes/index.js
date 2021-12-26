var express = require('express');
var router = express.Router();
var User = require("../models/user"); // getting model
var Recipe = require("../models/recipes");// getting model
const bcrypt = require("bcryptjs"); // for security 
/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express'}); // rendering default page 
});

router.get('/login', function(req, res, next) {
  res.render('site/login'); //rendering login page on '/login'
});


router.post("/login", async function (req, res, next) { 
  let user = await User.findOne({ email: req.body.email }); // checking email registered or not 
  // req.body.email is comming from form-input (veiws/site/login)
  if (!user) {      
    // return res.end("not exist");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password); // matching pass
  if (validPassword) { // if valid create session
    req.session.user = user; // session is just like the pass
    // return res.redirect("/");
    return res.render('index', { title: user.name }); // if user valid welcoming him on default pagee
  } else {
    // return res.end("wrong");
    return res.redirect("/login");
  }
});



router.get("/menu", async function (req, res, next) {
  let recipes = await Recipe.find();
  return res.render("site/menuPage", {pagetitle: "Menu", recipes,}); // rendering menu and passing all the recipes
});

router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart; // for storing cart
  if (!cart) cart = []; // if empty 
  let recipes = await Recipe.find({ _id: { $in: cart } }); // seleced item in cart by id
  let total = recipes.reduce(
    (total, recipes) => total + Number(recipes.price),0 // suming all the prices
  );
  return res.render("site/cart", { recipes, total });// rendering cart and passing selected recipe and total value in views/site/cart
});

router.get("/add-cart/:id", function (req, res, next) { // putting items to cart
  let cart = req.cookies.cart; // for storing cart
  if (!cart) cart = [];
  cart.push(req.params.id); // adding recipes of selected to cart
  res.cookie("cart", cart);
  res.redirect("/menu"); // back to menu
});

module.exports = router;
