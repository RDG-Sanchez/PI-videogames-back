// Import Sequelize Instance
const { sequelize } = require("../db.js");

// Import Validators
const { isUUID } = require("../validations/validators.js");

// Import Librarys
const axios = require("axios");
require("dotenv").config();

// Extract Models from Sequelize, Import Env Variables & Operators
const { Videogame, Genre } = sequelize.models;
const { Op } = require("sequelize");
const { API_KEY } = process.env;

// Creating Services
const serv_getGames = async () => {
  try {
    const RESPONSE_DB = await Videogame.findAll({
      include: [
        {
          model: Genre,
          through: { attributes: [] },
        },
      ],
    });

    const response_api_1 = await axios(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=25`
    );

    const response_api_2 = await axios(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=2&page_size=25`
    );

    const response_api_3 = await axios(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=3&page_size=25`
    );

    const response_api_4 = await axios(
      `https://api.rawg.io/api/games?key=${API_KEY}&page=4&page_size=25`
    );

    const RESPONSE_API = [
      ...response_api_1.data.results,
      ...response_api_2.data.results,
      ...response_api_3.data.results,
      ...response_api_4.data.results,
    ].map((game) => ({
      id: game.id,
      name: game.name,
      description_raw: game.description_raw,
      background_image: game.background_image,
      platforms: game.platforms,
      genres: game.genres,
      rating: game.rating,
    }));

    return [...RESPONSE_DB, ...RESPONSE_API];
  } catch (error) {
    throw new Error(error.message);
  }
};

const serv_getGameByID = async (id) => {
  if (!id) throw new Error("No ID has been entered");

  if (Number(id)) {
    try {
      const response = await axios(
        `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  } else if (isUUID(id)) {
    try {
      const response = await Videogame.findByPk(id, {
        include: [
          {
            model: Genre,
            through: { attributes: [] },
          },
        ],
      });
      if (response) {
        return response;
      } else {
        throw new Error("Videogame not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error("The ID entered is not valid");
  }
};

const serv_searchGames = async (name) => {
  try {
    const response_db = await Videogame.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      include: [
        {
          model: Genre,
          through: {
            attributes: [],
          },
        },
      ],
      limit: 15,
    });

    const response_api = await axios(
      `https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`
    );

    const allResults = [...response_db, ...response_api.data.results].slice(
      0,
      15
    );

    if (allResults.length > 0) {
      return allResults;
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const serv_createGame = async (game) => {
  const {
    name,
    description_raw,
    platforms,
    background_image,
    released,
    rating,
    genres,
  } = game;

  const validPlatforms = [
    "PC",
    "macOS",
    "Linux",
    "PlayStation 5",
    "PlayStation 4",
    "PlayStation 3",
    "PlayStation 2",
    "Xbox Series X/S",
    "Xbox One",
    "Xbox 360",
    "Xbox",
    "Nintendo Switch",
    "Nintendo 3DS",
    "NeoGeo",
    "NES",
    "SNES",
    "Wii",
    "GameCube",
    "PSP",
    "PS Vita",
    "WEB",
  ];

  const validGenres = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ];

  if (
    !name ||
    !description_raw ||
    !platforms ||
    !background_image ||
    !released ||
    !rating ||
    !genres
  )
    throw new Error("Missing data");

  if (typeof name != "string")
    throw new Error("The value you entered for 'name' is incorrect");

  if (typeof description_raw != "string")
    throw new Error("The value you entered for 'description' is incorrect");

  if (!(platforms instanceof Array))
    throw new Error("The value you entered for 'platforms' is incorrect");

  if (platforms.length === 0)
    throw new Error("The 'platforms' element cannot be empty");

  if (
    platforms.filter((platform) => !validPlatforms.includes(platform)).length >
    0
  )
    throw new Error("Platforms: There are invalid values");

  if (typeof background_image != "string")
    throw new Error("The value you entered for 'image' is incorrect");

  if (typeof released != "string")
    throw new Error("The value you entered for 'release_date' is incorrect");

  if (typeof rating != "number")
    throw new Error("The value you entered for 'rating' is incorrect");

  if (rating > 5)
    throw new Error("The 'rating' must be less than or equal to 5");

  if (rating === 1) throw new Error("The 'rating' must be greater than 1");

  if (!(genres instanceof Array))
    throw new Error("The value you entered for 'genres' is incorrect");

  if (genres.length === 0)
    throw new Error("The 'genres' element cannot be empty");

  if (
    genres
      .map((genre) => Number(genre))
      .filter((genre) => !validGenres.includes(genre)).length > 0
  )
    throw new Error("Genres: There are invalid values");

  if (new Date(released).getFullYear() < 1950)
    throw new Error("The 'released' value must have a year after 1950");

  try {
    const genresFilter = genres
      .map((genre) => Number(genre))
      .filter((genre) => validGenres.includes(genre));

    const platformsFilter = platforms
      .filter((platform) => validPlatforms.includes(platform))
      .map((platform) => {
        return { platform: { name: platform } };
      });

    const [videogame, created] = await Videogame.findOrCreate({
      where: { name },
      defaults: {
        description_raw,
        platforms: platformsFilter,
        background_image,
        released,
        rating,
      },
    });

    if (created) {
      await videogame.addGenre(genresFilter);
      return videogame;
    } else {
      throw new Error("The game you tried to create already exists");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const serv_deleteGame = async (id, key) => {
  if (!id) throw new Error("No ID has been entered");
  if (!key) throw new Error("No KEY has been entered");

  try {
    const videogame = await Videogame.findByPk(id);
    if (videogame) {
      if (key === videogame.id) {
        await videogame.destroy();

        return "Videogame successfully removed";
      } else {
        throw new Error("The key entered is incorrect");
      }
    } else {
      throw new Error("Videogame not found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  serv_getGames,
  serv_getGameByID,
  serv_searchGames,
  serv_createGame,
  serv_deleteGame,
};

/*

-- Estructura --

videogame -> {
    name: string, -> name
    description: string, -> description_raw
    platforms: array w/ objects, -> platforms
    image: string, -> background_image
    release_date: string, -> released
    rating: integer -> rating
}

-- Rutas --

GET /videogames -> Obtiene un arreglo de objetos (juegos)
GET /videogames/:id -> Obtiene un juego por ID
GET /videogames?name=".." -> Obtiene 15 juegos que se encuentre por QUERY
POST /videogames -> Creara un juego con sus respectivos datos, vinculandolo con sus respectivos generos

-- Endpoints --

Videojuegos -> "https://api.rawg.io/api/games"
Por id -> "https://api.rawg.io/api/games/{id}"
Por nombre -> "https://api.rawg.io/api/games?search={game}"
Por genero -> "https://api.rawg.io/api/genres"

-- Anotacion para buscar un juego por ID -- 

Cuando busquemos un juego por ID primero iremos a buscarlo en la DB, si la DB no lo tiene ahí si hacemos una peticion a la API para que nos lo busque, lo muestre y lo guarde en la DB.

*/
