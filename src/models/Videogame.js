const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "videogame",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "NAME: You must enter a value",
          },
          len: {
            args: [1, 35],
            msg: "NAME: Must be between 1 and 35 characters",
          },
        },
      },
      description_raw: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "DESCRIPTION: You must enter a value",
          },
          len: {
            args: [30, 2500],
            msg: "DESCRIPTION: Must be between 30 and 2500 characters.",
          },
        },
      },
      platforms: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "PLATFORMS: You must enter a value",
          },
        },
      },
      background_image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "IMAGE URL: You must enter a value",
          },
          isUrl: {
            msg: "IMAGE URL: The URL entered is not valid",
          },
          max: {
            args: [[512]],
            msg: "IMAGE URL: Maximum must be 512 characters",
          },
        },
      },
      released: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "RELEASE DATE: You must enter a value",
          },
          isAfter: {
            args: ["1950-01-01"],
            msg: "RELEASE DATE: You must enter a year after 1950",
          },
        },
      },
      rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "RATING: You must enter a value",
          },
          min: { args: [[1]], msg: "RATING: Minimum must be 1" },
          max: { args: [[5]], msg: "RATING: Maximum must be 5" },
        },
      },
      database: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
    }
  );
};

/*

-- Videogame by ID --

videogame: {
  id: integer,
  name: string,
  description: string,
  platforms: array w/ objects,
  background_image: string,
  released: string,
  rating: integer
}

videogame_structure: {
  id: 1,
  name: "Game of Example",
  description: "This is a game for practice with Sequelize and Express",
  platforms: [
    {
      platform: {
        id: 1,
        name: "Windows",
      },
    },
    {
      platform: {
        id: 2,
        name: "macOS",
      },
    },
  ],
  background_image:
    "https://media.rawg.io/media/games/9c5/9c5bc0b6e67102bc96dcf1ba41509e42.jpg",
  released: "2024-02-14",
  rating: 7.7,
};

*/

/* const videogame_structure = {
  id: 1,
  name: "Game of Example",
  description: "This is a game for practice with Sequelize and Express",
  platforms: [
    {
      platform: {
        id: 1,
        name: "Windows",
      },
    },
    {
      platform: {
        id: 2,
        name: "macOS",
      },
    },
  ],
  background_image:
    "https://media.rawg.io/media/games/9c5/9c5bc0b6e67102bc96dcf1ba41509e42.jpg",
  released: "2024-02-14",
  rating: 7.7,
}; */
