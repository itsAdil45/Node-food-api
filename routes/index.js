var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Recipe = require("../models/recipes");
const bcrypt = require("bcryptjs");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('site/login');
});

router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
 
  if (!user) {
    
    // return res.end("not exist");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    return res.redirect("/");
  } else {
    // return res.end("wrong");
    return res.redirect("/login");
  }
});



router.get("/menu", async function (req, res, next) {
  let recipes = await Recipe.find();
  return res.render("site/menuPage", {
    pagetitle: "Menu",
    recipes,
  });
});

router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let recipes = await Recipe.find({ _id: { $in: cart } });
  let total = recipes.reduce(
    (total, recipes) => total + Number(recipes.price),0
  );
  return res.render("site/cart", { recipes, total });
});

router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/menu");
});

module.exports = router;
