// Import Router from Express
const { Router } = require("express");

// Import Routers
const genres = require("./genres.routes");
const videogames = require("./videogames.routes");

// Create Router
const router = Router();

// * --- Routes ---

// Router for Videogames
router.use("/videogames", videogames);

// Router for Genres
router.use("/genres", genres);

// * --- Routes ---

// Export Router
module.exports = router;
