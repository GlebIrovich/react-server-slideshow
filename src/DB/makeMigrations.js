const knex = require(`${__dirname}/knex`)
const rollbackAndMigrate = async () => {
  try {
    await knex.migrate.rollback()
    console.log('Rollback successfully');
    await migrate();
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

    // .then(()=>{
    //   console.log('Migrated successfully');
    // })
    // .finally(function () {
    //   console.log('Done!');
    //     return knex.destroy();
    // })
    // .catch((e)=> {
    //   console.log(knex);
    //   console.log('Migration failed:');
    //   console.log(e);
    // })
}

module.exports = {migrate, rollbackAndMigrate};
