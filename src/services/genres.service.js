// Import Sequelize Instance
const { sequelize } = require("../db.js");

// Import Librarys
const axios = require("axios");
require("dotenv").config();

// Extract Models from Sequelize and Env Variables
const { Genre } = sequelize.models;
const { API_KEY } = process.env;

// Creating Services

const serv_getGenres = async () => {
  try {
    const genresDB = await Genre.findAll();
    if (genresDB.length === 0) {
      const response = await axios(
        `http://api.rawg.io/api/genres?key=${API_KEY}`
      );

      const sendGenres = response.data.results.map((genre) => {
        return { name: genre.name };
      });

      await Genre.bulkCreate(sendGenres);
      return await Genre.findAll();
    } else {
      return await Genre.findAll();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = serv_getGenres;
