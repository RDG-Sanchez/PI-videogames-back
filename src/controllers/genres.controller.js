// Import Genres Services
const serv_getGenres = require("../services/genres.service.js");

// Creating Controllers
const getGenres = async (req, res) => {
  try {
    const response = await serv_getGenres();
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getGenres };
