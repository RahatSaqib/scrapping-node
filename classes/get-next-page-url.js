const axios = require('axios');
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
// const additionalUrl =process.env.ADDITIONAL_URL;
module.exports = class ClassGetNextPageUrl {
  constructor(...args) {
    this.path = "next-url";
    this.items = []

  }
  async getPages(url){
    try {
      return new Promise(async (resolve, reject) => {
        const { data } = await axios({
          method: "GET",
          url: url,
        });
        const $ = cheerio.load(data);
        const elementSelector = $("li.pagination-item"); //get all element with class pagination-item
        let pageCounter = 0;
        let totalPages = "";
        elementSelector.each((parentIndex, parentElement) => {
          // console.log($(parentElement).attr("data-testid"));
  
          //check statement if the attribute(data-testid) value is "pagination-list-item"
          if ($(parentElement).attr("data-testid") === "pagination-list-item") {
            totalPages = $(parentElement).find("a").text();
          }
        });
        pageCounter = parseInt(totalPages);
        let pages = [];
        var idx = 2;
        pages.push({ url: url });
        while (idx <= pageCounter) {
          //Adding value for iterate over pages
          let pageItem = {
            url: url + "&page=" + idx,
          };
          pages.push(pageItem);
          idx++;
        }
        resolve(pages);
      });
    } catch (err) {
      console.error(err);
    }
  }
  handle(e){
    let url = e;
    return this.getPages(url);
  }


};
