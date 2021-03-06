exports.up = function(knex, Promise) {
	return knex.schema.createTable("users", table => {
		table.increments("userId");
		table.string("googleId");
		table.string("facebookId");
		table.string("goodreadsId");
		table.string("email").unique();
		table.string("password");
		table.string("firstName");
		table.string("lastName");
		table.string("location");
		table.string("picture");
		table.text("bio", 140);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists("users");
};
