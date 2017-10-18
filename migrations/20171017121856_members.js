exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("members", table => {
    table.increments();
    table.string("firstName", 16).notNullable();
    table.string("lastName", 16).nullable();
    table
      .string("emailId", 32)
      .unique()
      .nullable();
    table
      .string("phoneNumber", 32)
      .unique()
      .nullable();
    table.enu("role", ["admin", "regular"]);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("members");
};
