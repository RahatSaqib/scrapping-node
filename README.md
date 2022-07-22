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
The api's url you will need to scrape data.

Url for scrape all the pages of initial url.
1. scrapTruckItem:  url : http://localhost:8443/scrape-truck-item , method : GET

If you want to individual function scrapping.
1. getNextPageUrl:  url : http://localhost:8443/next-url , method : GET
2. addItems:  url : http://localhost:8443/add-items , method : GET
3. getTotalAdsCount:  url : http://localhost:8443/total-ads , method : GET


### 3. For Testing Api's
```
$ npm run test
```
### 4. Questions/Thoughts:
#### 1. Ideas for error catching/solving, retry strategies?

&nbsp; &nbsp; Ans: For error solving I have use  promise for rejecting any request to cache for identifying exact problem or error.If any request reject it stores the 404 NOT FOUND property on url object.

#### 2. Accessing more ads from this link than the limit allows (max 50 pages)?
&nbsp; &nbsp; Ans: No, I cann't access more ads because the given link or url have only 8/9 pages for scrapping.

#### 3. Experience with CI/CD tools?
&nbsp; &nbsp; Ans: Yes, It was continuous integration for this. Whenever I pushed an update on git ,it test the api's with scripted test cases.  Continous Deployment can not be happen because I did not write any scipt for any deplpyment. It is done locally.

#### 4. Experience on this task?
&nbsp; &nbsp; Ans: It was a good ride for me. The task drive to me know further because it was very interesting for me. Love to learn new things and technology.
***
