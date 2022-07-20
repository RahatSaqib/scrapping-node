const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { resolve } = require("path");

const baseUrl = "https://www.otomoto.pl";
const additionalUrl =
  "/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc";
const url = baseUrl + additionalUrl;
const app = express();
const PORT = 8443;
let items = [];


//Api for get next page url
app.get("/next-url", function (req, res) {
  getNextPageUrl().then((pages) => {
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
  addItems().then((items) => {
    res.status(200).send(items);

    // Storing array of items to json file
    fs.writeFileSync("itemIdandUrl.json", JSON.stringify(items), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      return;
    });
  });
});

//Api for get-total-ads
app.get("/total-ads", function (req, res) {
  getTotalAdsCount().then((totalAds) => {
    res.status(200).send(totalAds);
  });
});

//Api for scrap-truck-item
app.get("/scrape-truck-item", function (req, res) {

  getNextPageUrl().then((pages)=>{
    let truckItems = []

    Promise.all(pages.map(async(page)=>{
      return new Promise((resolve ,reject)=>{
        console.log(baseUrl + page.url)
        scrapeTruckItem(baseUrl + page.url).then((data) => {
          // console.log(data)
          Promise.all(data.map(async(truckItem)=>{
            return new Promise ((res , rejt)=>{
              fetchTruckData(truckItem.url).then((item) => {
                truckItems.push({ ...truckItem, ...item });
                let concatedItem = { ...truckItem, ...item };
                res(concatedItem)
      
              });
            })
          })).then((items)=>{
            resolve()
      
          })
        });
      })
    })).then((items)=>{
      res.status(200).send(truckItems);
    })
  })

});

async function fetchTruckData(url) {
  return new Promise(async (resolve, reject) => {
    const truckData = await axios({
      method: "GET",
      url: url,
    });
    const truck$ = cheerio.load(truckData.data);
    // console.log(truck$.html())
    let registration_date = truck$(
      "#parameters > ul:nth-child(2) > li:nth-child(3)"
    ); //get all element with name article
    let production_date = truck$(
      "#parameters > ul:nth-child(1) > li:nth-child(5)"
    ); //get all element with name article
    let power = truck$("#parameters > ul:nth-child(1) > li:nth-child(8)"); //get all element with name article
    let text = registration_date.find("span").text();
    let truckItems = {
      registration_date: "",
      // mileage :'',
      power: "",
      production_date,
    };
    registration_date = registration_date.text().replace(/[^\d/]/g, "");
    power = power.text().replace(/[^\d]/g, "") + "hp";
    production_date = production_date.text().replace(/[^\d/]/g, "");
    truckItems.power = power;
    truckItems.production_date = production_date;
    if (text == "Pierwsza rejestracja" || text == "First Registration") {
      truckItems.registration_date = registration_date;
    }
    resolve(truckItems);
  });
}
async function scrapeTruckItem(pageUrl) {
  try {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios({
        method: "GET",
        url: pageUrl,
      });
      const $ = cheerio.load(data);

      const elementSelector = $(".ooa-p2z5vl article"); //get all element with name article

      elementSelector.each(async (parentIdx, parentElem) => {

          let truckItem = {
            id: "",
            title: "",
            price: "",
            registration_date: "",
            mileage: "",
            power: "",
          };
          truckItem.id = $(parentElem).attr("id");
          truckItem.title = $(parentElem).find("h2").text();
          truckItem.url = $(parentElem).find("h2").find("a").attr("href");
          truckItem.price = $(parentElem).find("div.e1b25f6f9").text();
          $(parentElem)
            .find("ul li:nth-child(2)")
            .each((idx, elem) => {
              truckItem.mileage = $(elem).text();
            });

          items.push(truckItem)

        });
        resolve(items)

      })
  } catch (err) {
    console.error("err");
  }
}

async function getTotalAdsCount() {
  try {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios({
        method: "GET",
        url: url,
      });
      const $ = cheerio.load(data);
      const elementSelector = $(".e1l24m9v0"); //get all element with class name e1l24m9v0
      // console.log(elementSelector.text())
      let totalAds = [];

      elementSelector.each((parentIdx, parentElem) => {
        //   console.log($(parentElem));
        totalAds = $(parentElem).text().replace(/[^\d]/g, "");
      });
      resolve(totalAds);
    });
  } catch (err) {
    console.error(err);
  }
}
async function addItems() {
  try {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios({
        method: "GET",
        url: url,
      });
      const $ = cheerio.load(data);
      const elementSelector = $(".ooa-p2z5vl article"); //get all element with name article
      elementSelector.each((parentIdx, parentElem) => {
        console.log($(parentElem).attr("id"));
        items.push({
          id: $(parentElem).attr("id"),
          url: $(parentElem).find("img").attr("src"),
        });
      });
      resolve(items);
    });
  } catch (err) {
    console.error(err);
  }
}
async function getNextPageUrl() {
  try {
    return new Promise(async (resolve, reject) => {
      const { data } = await axios({
        method: "GET",
        url: url,
      });
      const $ = cheerio.load(data);
      const elementSelector = $("li.pagination-item"); //get all element with class pagination-item
      let pageCounter = 0;
      let lastChar = "";
      elementSelector.each((parentIndex, parentElement) => {
        // console.log($(parentElement).attr("data-testid"));

        //check statement if the attribute(data-testid) value is "pagination-list-item"
        if ($(parentElement).attr("data-testid") === "pagination-list-item") {
          let str = $(parentElement).find("a").attr("href");

          // get the last character for pages
          lastChar = str.charAt(str.length - 1);

          // STATEMENT FOR PAGES GREATER THAN 9 AND LESS THAN 100
          if (lastChar == "0") {
            lastChar = str.charAt(str.length - 2);
          }
          pageCounter = parseInt(lastChar);
        }
      });
      let pages = [];
      var idx = 2;
      pages.push({ url: additionalUrl });
      while (idx <= pageCounter) {
        //Adding value for iterate over pages
        let pageItem = {
          url: additionalUrl + "&page=" + idx,
        };
        pages.push(pageItem);
        idx++;
      }
      console.log(pages);
      resolve(pages);
    });
  } catch (err) {
    console.error(err);
  }
}
app.listen(PORT, function () {
  console.log("Scrapping Otomoto at http://localhost:", PORT);
});
