const knex = require(`${__dirname}/knex`)
const rollback = () => {
  knex.migrate.rollback()
  .then(()=>{
    console.log('Rollback successfully completed');
  })
  .finally(function () {
    console.log('Done!');
      return knex.destroy();
  })
  .catch((e)=> {
    console.log(knex);
    console.log('Rollback failed:');
    console.log(e);
  })
}
const migrate = () => {
  knex.migrate.latest()
    .then(()=>{
      console.log('Migrated successfully');
    })
    .finally(function () {
      console.log('Done!');
        return knex.destroy();
    })
    .catch((e)=> {
      console.log(knex);
      console.log('Migration failed:');
      console.log(e);
    })
}

module.exports = {migrate, rollback};
