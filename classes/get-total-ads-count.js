const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const axiosRetry = require('axios-retry');

axiosRetry(axios, {
  retries: 5, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 503;
  },
});
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
