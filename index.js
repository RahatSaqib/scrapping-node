const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const fs = require("fs");

const baseUrl = "https://www.otomoto.pl";
const additionalUrl =
  "/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc";
const url = baseUrl + additionalUrl;
const app = express();
const PORT = 8443;

app.get("/next-url", function (req, res) {
  getNextPageUrl();
  res.status(200).send("Successfully written data to file");
});

async function getNextPageUrl() {
  try {
    const { data } = await axios({
      method: "GET",
      url: url,
    });
    const $ = cheerio.load(data);
    const elementSelector = $("li.pagination-item"); //get all element with class pagination-item
    let pageCounter = 0;
    let lastChar = "";
    $(elementSelector).each((parentIndex, parentElement) => {
      console.log($(parentElement).attr("data-testid"));

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

    // Storing array of pages to json file
    fs.writeFileSync("pages.json", JSON.stringify(pages), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      return;
    });
  } catch (err) {
    console.error(err);
  }
}
app.listen(PORT, function () {
  console.log("Scrapping Otomoto at http://localhost:", PORT);
});
