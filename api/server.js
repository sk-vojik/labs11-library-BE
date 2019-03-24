//-------------------------------------------TEST SERVER

const express = require("express");
const config = require("./middleware/middleware.js");
const server = express();
const db = require("../data/dbConfig");

const rp = require("request-promise");
const { parseString } = require("xml2js");

const userRoutes = require("./routes/userRoutes");

config(server);

server.get("/", (req, res) => {
  res.status(200).json({ api: "running" });
});

server.use("/users", userRoutes);

// server.get("/users", async (req, res) => {
//   try {
//     const users = await db("users").orderBy("userId");
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "no users displayed!" });
//   }
// });

server.get("/search", (req, res) => {
  rp.get(
    `https://www.goodreads.com/search/index.xml?key=${
      process.env.GOODREADS_KEY
    }&q=${req.body.title || req.body.authors}`
  ).then(result =>
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
        )
      })
    )
  );
});

module.exports = server;
