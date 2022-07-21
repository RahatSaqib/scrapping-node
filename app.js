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
              if (!uniqueItems.includes(truckItem.id)) {
                modifiedTruckItems.push({ ...truckItem, ...item });
                uniqueItems.push(truckItem.id);
              }

              let concatedItem = { ...truckItem, ...item };
              resolve(concatedItem);
            });
          });
        })
      ).then(() => {
        console.log(modifiedTruckItems.length);
        res.status(200).send(modifiedTruckItems);
      });
    });
  });
});

module.exports = app;
