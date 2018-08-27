import {rollbackAndMigrate} from './DB/makeMigrations'

( ()=> {
    try{
      rollbackAndMigrate();

    } catch(e) {
      console.log(e);
    }
  })();