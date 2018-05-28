process.env.NODE_ENV === 'production';
import express from 'express';
import knex from '../src/DB/knex';
import serverRenderer from './middleware/renderer';
import apiRouter from './apiRouter';
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const path = require('path');
// initialize the application and create the routes
const app = express();
const router = express.Router();


// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// router.use('/*', serverRenderer);
// other static resources should just be served as they are
router.use(express.static(
    path.resolve(__dirname, '..', 'build')
));
router.use(express.static(
  path.resolve(__dirname, '..', 'PROJECT_CONTENT')
));

// root (/) should always serve our server rendered page

router.get('/', serverRenderer);
router.get('/:chapter', serverRenderer);
// tell the app to use the above rules
app.use(router);
app.use('/api', apiRouter);
// start the app
app.listen(PORT, (error) => {
    if (error) {
        return console.log('something bad happened', error);
    }

    console.log("listening on " + PORT + "...");
});

knex.migrate.latest()
  .then(()=> {
    console.log('Tables migrated');
    return;
  })
  .then(() => {
    console.log('Server is ready!');
  })
