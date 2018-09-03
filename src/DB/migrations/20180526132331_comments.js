
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', (t) => {
    t.increments('id').primary();
    t.integer('slide');
    t.integer('chapter');
    t.string('author');
    t.text('text');
    t.string('tag');
    t.timestamp('date').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
