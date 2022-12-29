const express = require("express");
const serverless = require("serverless-http");
const {Client} = require('@notionhq/client');
const dotenv = require('dotenv');
dotenv.config();

const notion = new Client({auth: process.env.NOTION_API_KEY});
const app = express();
const router = express.Router();

async function getReports(filter, sorts) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_REPORTS_DATABASE_ID,
      filter,
      sorts,
    });
    return response.results;
  } catch (error){
    console.log(error.body);
  }
}

router.get("/", (req, res) => {
  getReports().then(response => {
    res.status(200).json(response);
  }).catch(error => { return res.send(error) });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
