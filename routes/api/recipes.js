var express = require('express');
const Recipes = require('../../models/recipes');
const validateRecipe = require('../../middleware/validateRecipe');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
var router = express.Router();


router.get("/", async (req, res) => {
    console.log(req.user);
    let recipes = await Recipes.find();
    return res.send(recipes);
});

router.get("/:id", async (req, res) => {
    try {

        let recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(400).send("product is not available with that id ");

        }
        return res.send(recipe);
    } catch (err) {
        return res.status(400).send("invalid id");

    }
});

router.put("/:id", async(req,res)=>{
    let recipe = await Recipes.findById(req.params.id);
    recipe.title = req.body.title;
    recipe.body = req.body.body;
    recipe.price = req.body.price;
    await recipe.save();
    return res.send(recipe);
});

router.delete("/:id", auth,admin, async(req,res)=>{
    let recipe = await Recipes.findByIdAndDelete(req.params.id);
    return res.send(recipe);
});

router.post("/", validateRecipe, async(req,res)=>{
  
    let recipe = new Recipes();
    recipe.title = req.body.title;
    recipe.body = req.body.body;
    recipe.price = req.body.price;
    await recipe.save();

    return res.send(recipe);
});


module.exports = router;