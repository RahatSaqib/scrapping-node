const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const additionalUrl = process.env.ADDITIONAL_URL;
const url = baseUrl + additionalUrl;
const ClassAddItems = require("./classes/add-items");
const ClassGetNextPageUrl = require("./classes/get-next-page-url");
const ClassGetTotalAdsCount = require("./classes/get-total-ads-count");
const ClassScrapeTruckItem = require("./classes/scrape-truck-item");
const addItems = new ClassAddItems();
const getNextPageUrl = new ClassGetNextPageUrl();
const getTotalAdsCount = new ClassGetTotalAdsCount();
const scrapeTruckItem = new ClassScrapeTruckItem();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
let items = [];
let reqTime = "";
let logger = (req, res, next) => {
  //middleware function
  reqTime = "";
  let current_datetime = new Date();
  reqTime = current_datetime;
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let url = req.url;
  const start = process.hrtime();
  reqTime = start;
  let log = `requesting ${url} - [${formatted_date}] `;

  console.log(log);
  let send = res.send;
  res.send = (result) => {
    let resTime = process.hrtime();
    let time = '';
    var seconds = Math.round(
      (resTime[0] * 1000 +
        resTime[1] / 1000000 -
        reqTime[0] * 1000 +
        reqTime[1] / 1000000) /
      1000);
    if(seconds > 60){
      var min = parseInt(seconds/60) 
      var carrier_seconds = seconds % 60;
      time = `${min}m ${carrier_seconds}s`
    }
    else{
      time = `${seconds}s`
    }
    console.log(
      `Find ${req.url}: ${res.statusCode} - Response Time : ${time}`
    );
    console.log("Response Type :", typeof result);
    res.send = send;
    return res.send(result);
  };
  next();
};

app.use(logger);

//Api for get next page url
app.get("/next-url", function (req, res) {
  getNextPageUrl.handle(url).then((pages) => {
    res.status(200).send(pages);

    // Storing array of pages to json file
    fs.writeFileSync("pages.json", JSON.stringify(pages), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      return;
    });
  });
});

//Api for add items id and url
app.get("/add-items", function (req, res) {
  addItems.handle(url).then((items) => {
    // console.log(items);
    res.status(200).send(items);
  });
});

//Api for get-total-ads
app.get("/total-ads", function (req, res) {
  getTotalAdsCount.handle(url).then((totalAds) => {
    res.status(200).send(totalAds);
  });
});

//Api for scrap-truck-item
app.get("/scrape-truck-item", function (req, res) {
  getNextPageUrl.handle(url).then((pages) => {
    let truckItems = [];
    let uniqueItems = [];
    Promise.all(
      pages.map((page) => {
        return new Promise((resolve, reject) => {
          addItems.handle(page.url).then((data) => {
            Promise.all(
              data.map((truckItem) => {
                return new Promise((res, rejt) => {
                  if (!uniqueItems.includes(truckItem.id)) {
                    truckItems.push(truckItem);
                    uniqueItems.push(truckItem.id);
                  }
                  res(truckItem);

                  // });
                });
              })
            ).then((items) => {
              resolve(items);
            });
          });
        });
      })
    ).then((items) => {
      let modifiedTruckItems = [];
      let uniqueItems = [];
      Promise.all(
        truckItems.map((truckItem) => {
          return new Promise((resolve, reject) => {
            scrapeTruckItem.handle(truckItem.url).then((item) => {
              // if (!uniqueItems.includes(item.id)) {
              //   modifiedTruckItems.push({ ...truckItem, ...item });
              //   uniqueItems.push(item.id);
              // }
              modifiedTruckItems.push({ ...truckItem, ...item });

              let concatedItem = { ...truckItem, ...item };
              resolve(concatedItem);
            });
          });
        })
      )
        .then(() => {
          console.log(modifiedTruckItems.length);
          res.status(200).send(modifiedTruckItems);
        })
        .catch((err) => {
          res.status(500);
        });
    }).catch((err)=>{
      res.status(500);

    })
  });
});

module.exports = app;
