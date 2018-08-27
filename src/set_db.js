const rollbackAndMigrate = require('./DB/makeMigrations')

( ()=> {
    try{
      rollbackAndMigrate();

    } catch(e) {
      console.log(e);
    }
  })();