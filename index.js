const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");

async function getAds() {
  try {
    const url = "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc"
    const {data} = await axios({
        method:"GET",
        url:url
    })
    const $ = cheerio.load(data)
    const elementSelector = $('article');
    $(elementSelector).each((parentIndex,parentElement)=>{

            $(parentElement).children().each((childIdx,childElement)=>{
                console.log($(childElement).text())
                
            })
        

    })

} catch (err){
    console.error(err)
}
}
getAds()
