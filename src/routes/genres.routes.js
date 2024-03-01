// Import Router
const { Router } = require("express");

// Create Router Genres
const genres = Router();

// Import Controller
const { getGenres } = require("../controllers/genres.controller");

// Create Routes

// ! Esta ruta obtiene todos los generos.
genres.get("/", getGenres);

// Export Router Genres
module.exports = genres;
