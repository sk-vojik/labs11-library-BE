exports.up = function(knex, Promise) {
  return knex.schema.createTable("inventory", table => {
    table.increments("inventoryId");
    table.integer("bookId");
    table
      .integer("userId")
      .unsigned()
      .references("userId")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.boolean("available").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("inventory");
};
