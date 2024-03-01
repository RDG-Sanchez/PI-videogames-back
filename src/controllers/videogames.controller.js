// Import Videogames Services
const {
  serv_getGames,
  serv_getGameByID,
  serv_searchGames,
  serv_createGame,
  serv_deleteGame,
} = require("../services/videogames.service");

// Creating Controllers
const getGames = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    try {
      const response = await serv_getGames();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const response = await serv_searchGames(name);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const getGameByID = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await serv_getGameByID(id);
    res.status(200).json(response);
  } catch (error) {
    if (error.message.includes("Videogame not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("No ID has been entered")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("The ID entered is not valid")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("404")) {
      res.status(404).json({ error: "API: Videogame not found" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const searchGames = async (req, res) => {
  const { name } = req.query;
  try {
    const response = await serv_searchGames(name);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createGame = async (req, res) => {
  const {
    name,
    description_raw,
    platforms,
    background_image,
    released,
    rating,
    genres,
  } = req.body;
  const newGame = {
    name,
    description_raw,
    platforms,
    background_image,
    released,
    rating,
    genres,
  };

  try {
    const response = await serv_createGame(newGame);
    res.status(200).json(response);
  } catch (error) {
    if (
      error.message.includes(
        "is incorrect" || error.message.includes("create already exists")
      )
    ) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const deleteGame = async (req, res) => {
  const { id, key } = req.query;
  try {
    const response = await serv_deleteGame(id, key);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getGames,
  getGameByID,
  searchGames,
  createGame,
  deleteGame,
};
