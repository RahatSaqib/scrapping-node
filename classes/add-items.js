const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = class ClassAddItems {
  constructor(...args) {
    this.path = "add-items";
    this.items = [];
  }
  async addItems(url) {
    try {
      return new Promise(async (resolve, reject) => {
        const { data } = await axios({
          method: "GET",
          url: url,
        });
        const $ = cheerio.load(data);
        const elementSelector = $(".ooa-p2z5vl article"); //get all element with name article
        elementSelector.each((parentIdx, parentElem) => {
          this.items.push({
            id: $(parentElem).attr("id"),
            url: $(parentElem).find("h2").find("a").attr("href"),
          });
        });
        resolve(this.items);
      });
    } catch (err) {
      console.error(err);
    }
  }
  async handleItems(url) {
    let itemList = await this.addItems(url);
    fs.writeFileSync("itemIdandUrl.json", JSON.stringify(this.items), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      return;
    });
    if (itemList.length > 0) {
      return itemList;
    }
  }
  handle(e) {
    let url = e;

    return this.addItems(url);
  }
};
