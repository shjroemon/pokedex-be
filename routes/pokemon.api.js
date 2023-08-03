const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();



router.get("/", (req, res, next) => {
  //input validation
  const allowedFilter = ["search", "type", "page", "limit"];
  try {
    let { page, limit, ...filterQuery } = req.query; // from the req/frontend side

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterKeys = Object.keys(filterQuery); // create arr from obj keys

    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    //processing logic
    //Number of items skip for selection
    let offset = limit * (page - 1);

    //Read data from db.json then parse to JSobject
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;
    // console.log(data);

    //Filter data
    let result = [];
    if (filterKeys.length) {
      if (filterKeys.includes("search")) {
        result = data.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(filterQuery.search.toLowerCase())
        );
      }

      if (filterKeys.includes("type")) {
        result = data.filter((pokemon) =>
          pokemon.types.includes(filterQuery.type)
        );
      }
    } else {
      result = data;
    }
    //then select number of result by offset
    result = result.slice(offset, offset + limit);
    //send response
    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
});



router.get("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    //   console.log(req.params);

    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;

    let currentIndex = data.findIndex((pokemon) => pokemon.id === parseInt(id));

    let totalIndex = data.length - 1;

    let prevIndex = currentIndex - 1;
    let nextIndex = currentIndex + 1;
    if (currentIndex === 0) {
      prevIndex = totalIndex;
    } else if (currentIndex === totalIndex) {
      nextIndex = 0;
    }

    const result = {
      previousPokemon: data[prevIndex],
      pokemon: data[currentIndex],
      nextPokemon: data[nextIndex],
    };

    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
});


router.post("/", (req, res, next) => {
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flying",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];

  try {
    let db = fs.readFileSync("pokemons.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;

    const { id, name, types, url } = req.body;
    console.log(req.body);

    if (!id || !name || !types || !url) {
      const exception = new Error(`Missing required data.`);
      exception.statusCode = 401;
      throw exception;
    }
    if (
      data.find(
        (pokemon) => pokemon.id === parseInt(id) || pokemon.name === name
      )
    ) {
      const exception = new Error(`The pokemon already exists.`);
      exception.statusCode = 401;
      throw exception;
    }
    if (types.length > 2) {
      const exception = new Error(`A pokemon can't have more than two types.`);
      exception.statusCode = 401;
      throw exception;
    }
    if (!pokemonTypes.filter((pokemonType) => pokemonType !== types.join())) {
      const exception = new Error(`Invalid pokemon type.`);
      exception.statusCode = 401;
      throw exception;
    }

    const newPokemon = { id: parseInt(id), name, types, url };
    if (newPokemon.types[1] === null) newPokemon.types.pop();
    data.push(newPokemon);

    db = JSON.stringify(db);
    fs.writeFileSync("pokemons.json", db);
    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});

module.exports = router;