const express = require("express");
const router = express.Router();
const Inventory = require("../helpers/usersModel");

const db = require("../../data/dbConfig");

//GET all users

router.get("/", async (req, res) => {
  try {
    const users = await db("users").orderBy("userId");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve users at this time." });
  }
});

//GET user by id

router.get("/:id", async (req, res) => {
  try {
    const user = await db("users")
      .where({ userId: req.params.id })
      .first();
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not retrieve the user at this time." });
  }
});

//GET user inventory

router.get("/:id/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.getInventory(req.params.id);
    console.log(inventory);
    if (inventory) {
      res.status(200).json(inventory);
    } else {
      res.status(404).json(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//POST to inventory

router.post("/:id/inventory", async (req, res) => {
  try {
    const book = rp
      .get(
        `https://www.goodreads.com/search/index.xml?key=${
          process.env.GOODREADS_KEY
        }&q=${req.body.title || req.body.authors}`
      )
      .then(result =>
        parseString(result, (err, goodreadsResult) =>
          res.json({
            books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
              work => ({
                goodreadsId: work.best_book[0].id[0]._,
                title: work.best_book[0].title[0],
                authors: work.best_book[0].author[0].name[0],
                covers: [work.best_book[0].image_url[0]],
                average_rating: [work.average_rating[0]]
              })
            )[0]
          })
        )
      );
    const inventoryItem = await db("inventory").insert({
      bookId: book.goodReadsId
    });
    if (inventoryItem) {
      res.status(200).json({ message: "Book added to your shelf" });
    } else {
      return res.status(404).json(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
