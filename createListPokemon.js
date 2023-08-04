const fs = require("fs");
const csv = require("csvtojson");
const { faker } = require("@faker-js/faker");

const createData = async () => {
  let newData = await csv().fromFile("pokemon.csv");
  let data = JSON.parse(fs.readFileSync("pokemons.json"));

  newData = newData.slice(0, 721).map((e, i) => {
    if (e.Type1 && e.Type2) {
      //lowercase to use mehod includes()
      let type1 = e.Type1.toLowerCase();
      let type2 = e.Type2.toLowerCase();
      return {
        id: Number(i + 1),
        name: e.Name,
        types: [type1, type2],
        height: faker.datatype.number({ max: 100 }),
        weight: faker.datatype.number({ max: 100 }),
        url: `https://pokedex-be-8s22.onrender.com/images/${i + 1}.jpg`,
        description: faker.company.catchPhrase(),
        abilities: faker.company.catchPhraseAdjective(),
      };
    }
    if (!e.Type2) {
      let type1 = e.Type1.toLowerCase();
      return {
        id: Number(i + 1),
        name: e.Name,
        types: [type1],
        height: faker.datatype.number({ max: 100 }),
        weight: faker.datatype.number({ max: 100 }),
        url: `https://pokedex-be-8s22.onrender.com/images/${i + 1}.jpg`,
        description: faker.company.catchPhrase(),
        abilities: faker.company.catchPhraseAdjective(),
      };
    }
  });
  data.data = newData.slice(0, 721);
  let totalPokemon = newData.length;
  data.totalPokemon = totalPokemon;
  fs.writeFileSync("pokemons.json", JSON.stringify(data));
};
createData();