const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = class ClassScrapeTruckItem {
  constructor(...args) {
    this.path = "scrape-truck-item";
    this.truckItems = {
      registration_date: "",
      mileage: "",
      price: "",
      power: "",
      production_date: "",
    };
  }
  async fetchTruckData(url) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(url)
        .then((response) => {
          const truck$ = cheerio.load(response.data);
          // console.log(truck$.html())
          let registration_date = truck$(
            "#parameters > ul:nth-child(2) > li:nth-child(3)"
          ); //get all element with name article
          let production_date = truck$("offer-main-params > span:nth-child(1)"); //get all element with name article
          let price = truck$(".price-wrapper").attr("data-price");
          let power = truck$("#parameters > ul:nth-child(1) > li:nth-child(8)"); //get all element with name article
          let text = registration_date.find("span").text();
          this.truckItems.price = price;
          registration_date = registration_date.text().replace(/[^\d/]/g, "");
          power = power.text().replace(/[^\d]/g, "") + "hp";
          production_date = production_date.text().replace(/[^\d/]/g, "");
          this.truckItems.power = power;
          this.truckItems.production_date = production_date;
          if (text == "Pierwsza rejestracja" || text == "First Registration") {
            this.truckItems.registration_date = registration_date;
          }

          resolve(this.truckItems);
        })
        .catch((error) => {
          resolve({
            registration_date: "",
            mileage: "",
            power: "",
            price: "",
            production_date: "",
            url: "404 NOT FOUND",
          });
        });
    });
  }
  handle(e) {
    return this.fetchTruckData(e);
  }
};
