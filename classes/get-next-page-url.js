const axios = require('axios');
const cheerio = require("cheerio");
const fs = require("fs");
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
            // let str = $(parentElement).find("a").attr("href");
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
        // console.log(pages);
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
