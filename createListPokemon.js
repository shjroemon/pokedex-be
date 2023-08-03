const fs = require("fs");

const transformData = () => {
  let dataArr = JSON.parse(fs.readFileSync("pokemons.json")).slice(0, 721);

  dataArr = dataArr.map((el, index) => {
    const id = index + 1;
    const { Name, Type1, Type2 } = el;
    const name = Name;
    const types = [Type1, Type2];

    return {
      id,
      name,
      types,
      // url: `http://localhost:5000/images/${id}.png`
      url: ``,
    };
  });

  const totalPokemons = dataArr.length;
  const data = { data: dataArr, totalPokemons };

  fs.writeFileSync("pokemons.json", JSON.stringify(data));
};

transformData();