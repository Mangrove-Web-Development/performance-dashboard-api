const express = require("express");
const serverless = require("serverless-http");
const {Client} = require('@notionhq/client');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();

const notion = new Client({auth: process.env.NOTION_API_KEY});
const app = express();
const router = express.Router();

async function getReports(clientId) {
  const filter = {
    property: 'Client',
    relation: {
      contains: clientId,
    }
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_REPORTS_DATABASE_ID,
      filter: filter,
    });
    return response.results;
  } catch (error){
    console.log(error.body);
  }
}

async function getClients() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CLIENTS_DATABASE_ID,
    });
    return response.results;
  } catch (error){
    console.log(error.body);
  }
}

router.get("/reports", (req, res) => {
  getReports().then(response => {
    res.status(200).json(response);
  }).catch(error => { return res.send(error) });
});

router.get("/clients", (req, res) => {
  getClients().then(response => {
    res.status(200).json(response);
  }).catch(error => { return res.send(error) });
});

router.get("/clients/:clientId", (req, res) => {
  getReports(req.params.clientId).then(response => {
    res.status(200).json(response);
  }).catch(error => { return res.send(error) });
});

app.use(cors());
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
