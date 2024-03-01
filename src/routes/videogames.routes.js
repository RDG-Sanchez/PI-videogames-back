// Import Router
const { Router } = require("express");

// Create Router Videogames
const videogames = Router();

// Import Controllers
const {
  getGames,
  getGameByID,
  searchGames,
  createGame,
  deleteGame,
} = require("../controllers/videogames.controller");

// Create Routes

// ! Esta ruta envia todos los videojuegos y tambien busca por query.
videogames.get("/", getGames);

// ! Esta ruta envia un videojuego por id.
videogames.get("/id/:id", getGameByID);

// ! Esta ruta envia videojuegos buscados por query.
videogames.get("/search", searchGames);

// ! Esta ruta recibe un videojuego.
videogames.post("/create", createGame);

// ! Esta ruta elimina un videojuego por id.
videogames.delete("/delete", deleteGame);

// Export Router Videogames
module.exports = videogames;
