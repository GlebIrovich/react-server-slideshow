// /collector.js
// this script is used to prepare users data before the project is built
const fs = require('fs');
const path = require('path')
const Root = path.resolve(__dirname, '../PROJECT_CONTENT/')
const DB = path.resolve(__dirname, './Components/App/ProjectMap.json');

// Unit constructor
let Unit = function() {};

let dataMain = {
    units: []
};
// 1) gather data from main dir
(function(){
    let data = dataFromJson(`${Root}/main.json`);
    // set default title
    data.title ? dataMain.title = data.title : dataMain.title = "DEFAULT TITLE";
    // set default contributors
    dataMain.contributors = data.contributors ?  data.contributors : "NO CONTRIBUTORS";
    // set default description
    dataMain.description = data.description ?  data.description :  "NO DESCRIPTION";
    // set default color
    dataMain.color = data.color ?  data.color : "#041199";

    // 3) collect data about units and slides
    fs.readdirSync(Root).forEach(dir => {
        if (dir.includes('logo')){
            dataMain.logo = dir;
        } else if (dir[0] !== '.' && fs.lstatSync(`${Root}/${dir}`).isDirectory()){
            let unit = new Unit();
            unit.folder = dir;
            unit.unitPath = `${dir}/`;
            dataMain.units.push(unit);
        }
    });

    //  4) map slides and their paths. Create MDs of the units
    for(i in dataMain.units){
        let slides = fs.readdirSync(`${Root}/${dataMain.units[i].unitPath}`).filter(function(name){
            return name[0] !== "." && !name.includes('details'); })
        // sort slides

        try{
          dataMain.units[i].slides = slides.sort(function(a, b) {
            return a.match(/\d+/)[0] - b.match(/\d+/)[0];
          });
        } catch(e){
          console.log(`SLIDES IN FOLDER /${dataMain.units[i].unitPath} WERE NOT SORTED. CHECK MANUAL FOR PROPER NAMING.
            use digits in the name to order your slides.
            Slides in the final version will be unordered.`);
          dataMain.units[i].slides = slides;
        }

        dataMain.units[i].slidesPaths = slides.map(slide => {
            return dataMain.units[i].unitPath + slide;
        });
        // collect data from details.json
        let data = dataFromJson(`${Root}/${dataMain.units[i].unitPath}details.json`);

        // check if details.json is correct
        if (data.title) {

          dataMain.units[i].title = data.title;
          // check if there are titles
          if(data.subchapters && data.subchapters.length){
            dataMain.units[i].subchaptersTitles = data.subchapters;
          } else {
            dataMain.units[i].subchaptersTitles = [];
          }
          // check if there are numbers
          if (data.subchaptersSlides && data.subchaptersSlides.length) {

            dataMain.units[i].subchaptersNumbers = data.subchaptersSlides;

            // create slide maps for every subchapter
            dataMain.units[i].subchaptersSlides = [];
            let counter = 0
            let prev = dataMain.units[i].slides.length;
            for (let j = dataMain.units[i].subchaptersNumbers.length; j--;) {
              let stack = dataMain.units[i].slidesPaths.slice(dataMain.units[i].subchaptersNumbers[j]-1, prev);
              dataMain.units[i].subchaptersSlides.unshift(stack)
              prev = dataMain.units[i].subchaptersNumbers[j] - 1;
            }
          } else {
            dataMain.units[i].subchaptersNumbers = new Array(dataMain.units[i].subchaptersTitles.length)
          }
        } else {
          console.log('Title was not provided. Unit will be excluded from the list');
          // delete unit from dataMain
          dataMain.units.splice(i,1);
        }
    }
    // sort units based on folder name
    try{
      dataMain.units.sort(function(a, b) {
        return a.folder.match(/\d+/)[0] - b.folder.match(/\d+/)[0];
      });
    } catch(e){
      console.log(`CHAPTERS WERE NOT SORTED. CHECK MANUAL FOR PROPER NAMING.
        Use names with digits to succesfuly sort chapter folders`);

    }


    fs.writeFileSync(DB, JSON.stringify(dataMain, null, 4), { flag: 'w' });

})();
// HELPER FUNCTIONS

function dataFromJson(path){
    return JSON.parse(fs.readFileSync(path, 'utf8', (err, data) => {
        if (err) { throw err };
        }).toString())
}
console.log('FILE MAPPING: Succesfuly completed');
