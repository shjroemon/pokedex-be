var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).send("Welcome to Pokerdex!aaaa");
});

/* Pokemon router */
const pokemonRouter = require("./pokemon.api");
router.use("/pokemons", pokemonRouter);

module.exports = router;