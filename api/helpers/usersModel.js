const knex = require("knex");
const knexConfig = require("../../knexfile");

const db = knex(knexConfig.development);

module.exports = {
  getInventory
};

function getInventory(userId) {
  const items = db("inventory")
    .join("users", "inventory.userId", "users.userId")
    // .join("items", "inventory.itemId", "items.itemId")
    .select(
      "users.firstName",
      "inventory.inventoryId",
      "inventory.bookId",
      "inventory.availability"
    )
    .where("users.userId", userId);

  return items;
}
