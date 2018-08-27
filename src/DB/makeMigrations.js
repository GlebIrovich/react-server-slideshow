const knex = require(`${__dirname}/knex`)
const rollbackAndMigrate = async () => {
  try {
    await knex.migrate.rollback()
    console.log('Rollback successfully');
    await migrate();
    return knex.destroy();
  } catch(e) {
    console.log('Rollback failed:');
    console.log(e);
  }
}
const migrate = async () => {
  try {
    await knex.migrate.latest()
    console.log('Migrated successfully');
  } catch(e) {
    console.log('Migration failed:');
    console.log(e);
  }
}

module.exports = rollbackAndMigrate;
