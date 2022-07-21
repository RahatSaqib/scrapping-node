const axios = require('axios');
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = class ClassGetTotalAdsCount {
  constructor(...args) {
    this.path = "total-ads";
    this.items = []

  }
  getTotalAdsCount(url){
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
        // console.log(totalAds)
        resolve(totalAds);
      });
    } catch (err) {
      console.error(err);
    }
  }
  handle(e){
    let url  = e;
    return this.getTotalAdsCount(url)
  }

};