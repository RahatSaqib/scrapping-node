# Scrapping Otomoto By Node

***

## 【Introduction of Scrapping Node】
- This app is based on scrapping truck items and their info from specific URL.
It will initially run and show the result of assigned task url : https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc

&nbsp;


## 【Procedure】

### 1. Execute command below .
```
$ git clone https://github.com/RahatSaqib/scrapping-node.git
$ cd scrapping-node
$ npm install
```

### 2. For Running the app.
```
$ npm run start 
```
The api's JSON body that you will need to scrape data.
Example: 


{
  url :"https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc"
}


You can use  1st page url of any other item list for scarpe all the existing pages from otomoto website.

Url for scrape all the pages of initial url or your desired url .
1. scrapTruckItem:  url : http://localhost:8443/scrape-truck-item , method : POST

If you want to individual function scrapping.
1. getNextPageUrl:  url : http://localhost:8443/next-url , method : POST
2. addItems:  url : http://localhost:8443/add-items , method : POST
3. getTotalAdsCount:  url : http://localhost:8443/total-ads , method : POST


### 3. For Testing Api's
```
$ npm run test
```
### 4. Questions/Thoughts:
#### 1. Ideas for error catching/solving, retry strategies?

&nbsp; &nbsp; Ans:  For error solving I have used  Promise for rejecting any request to cache for identifying the exact problem or error.If any request rejects it stores the 404 NOT FOUND property on the url object..

#### 2. Accessing more ads from this link than the limit allows (max 50 pages)?
&nbsp; &nbsp; Ans: No, I can't access more ads because the given link or url has only 8/9 pages for scrapping. But rather than this given url , I have tried the Mercedes car section where there are 59 pages of items. I can scrape it but it takes too much response time.

#### 3. Experience with CI/CD tools?
&nbsp; &nbsp; Ans: Yes, I experienced CI/CD tools in this project. Whenever I push an update on git , it tests the api's with scripted test cases. Continuous Deployment can not happen because I did not write any script for any deployment. It is done locally.

#### 4. Experience on this task?
&nbsp; &nbsp; Ans: It was a good ride for me. The task drove me to know further because it was very interesting for me. Love to learn new things and technology.
***
