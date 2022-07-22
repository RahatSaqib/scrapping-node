const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
module.exports = class ClassScrapeTruckItem {
  constructor(...args) {
    this.path = "scrape-truck-item";
    this.truckItems = {
      title:'',
      price: "",
      registration_date: "",
      production_date: "",
      mileage: "",
      power: "",
    };
  }
  async fetchTruckData(url) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(url)
        .then((response) => {
          const truck$ = cheerio.load(response.data);
          // console.log(truck$.html())
          let title = truck$('#siteWrap > main > section > div.offer-header__row.hidden-xs.visible-tablet-up > h1')
          let registration_date = truck$(
            "#parameters > ul:nth-child(2) > li:nth-child(3)"
          ); //get all element with name article
          let production_date = truck$("div.offer-header__row.visible-xs > span > span:nth-child(1)"); //get all element with nth-child for production date 
          let mileage = truck$("div.offer-header__row.visible-xs > span > span:nth-child(2)"); //get all element with nth-child for production date 
          let currency = truck$('#siteWrap > main > section > div.offer-header__row.hidden-xs.visible-tablet-up > div.offer-price > div.wrapper > span > span')
          currency = currency.text()
          let price = truck$(".offer-price").attr("data-price");
          let power = truck$("#parameters > ul:nth-child(1) > li:nth-child(8)"); //get all element with nth-child for power 

          
          let text = registration_date.find("span").text();
          title = title.text().replace(/^\s+|\s+$/g ,'')
          registration_date = registration_date.text().replace(/[^\d/]/g, "");
          power = power.text().replace(/[^\d]/g, "") + "hp";
          production_date = production_date.text().replace(/[^\d/]/g, "");
          mileage = mileage.text().replace(/[^\dkm]/g, "");
          price = price.replace(' ', ",");

          this.truckItems.title = title
          this.truckItems.price = price + ' ' + currency;
          this.truckItems.power = power;
          this.truckItems.production_date = production_date;
          this.truckItems.mileage = mileage;

          if (text == "Pierwsza rejestracja" || text == "First Registration") {
            this.truckItems.registration_date = registration_date;
          }

          resolve(this.truckItems);
        })
        .catch((error) => {
          // console.log(error.message ,error.statusCode)
          // reject(error)
          resolve({
            status: "404 NOT FOUND",
          });
        });
    });
  }
  handle(e) {
    return this.fetchTruckData(e);
  }
};
