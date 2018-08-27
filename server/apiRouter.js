import express from 'express';
import { log } from 'util';
const csv = require('express-csv');
const router = express.Router();
const knex = require('../src/DB/knex');

router.get('/comments/:chapter', async (req, res) => {
  // DB connection
  const comments = await knex('comments')
    .select('*')
    .where('chapter', req.params.chapter)

  res.status(200).send(comments);

});

router.post('/comments', async (req, res) => {
  // DB connection

  await knex('comments')
    .insert({
      author  : req.body.author,
      text    : req.body.text,
      tag     : req.body.tag,
      chapter : req.body.chapter,
      slide   : req.body.slide
    })
  const comments = await knex('comments')
    .select('*')
    .where('chapter', req.body.chapter)
  res.status(201).send(comments);

});

router.get('/report', async (req, res) => {
  const columns = {
    id : 'id',
    slide : 'slide',
    chapter :'chapter',
    author: 'author',
    text: 'text',
    tag: 'tag',
    date: 'date'
  }
  const data = await knex('comments')
    .select('*')
  data.unshift(columns)
  for(let record of data){
    try {
      record.slide++
    } catch (e) {

    }
    
  }
  res.setHeader('Content-disposition', 'attachment; filename=report.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).csv(data).send();
})

module.exports = router;
