( ()=> {
    try{
      rollbackAndMigrate();

    } catch(e) {
      console.log(e);
    }
  })();