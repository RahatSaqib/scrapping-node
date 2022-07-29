const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const axiosRetry = require('axios-retry');


module.exports = class ClassGetTotalAdsCount {
  constructor(...args) {
    this.path = "total-ads";
    this.items = [];
  }
  getTotalAdsCount(url) {
    try {
      return new Promise(async (resolve, reject) => {
        const { data } = await axios({
          method: "GET",
          url: url,
        });
        const $ = cheerio.load(data);
        const elementSelector = $(".e1l24m9v0"); //get all element with class name e1l24m9v0

        let totalAds = [];
        elementSelector.each((parentIdx, parentElem) => {
          totalAds = $(parentElem).text().replace(/[^\d]/g, "");
        });
        resolve(totalAds);
      });
    } catch (err) {
      console.error(err);
    }
  }
  handle(e) {
    let url = e;
    return this.getTotalAdsCount(url);
  }
};
