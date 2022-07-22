const cors = require("cors");
const bodyParser = require("body-parser");
const request = require('supertest');
const app =  require( "../app");
var should = require("should");
let params ={
  url :"https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc"
}
describe('Get Next Page URL', () => {
    it('should get next url', (done) => {
        request(app).post("/next-url")
        .send(params)
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          // HTTP status should be 200
          res.status.should.equal(200);
          // Error key should be false.
          res.error.should.equal(false);
          done();
    });
 });
});
describe('Get Total Ads', () => {
  it('should get total ads', (done) => {
      request(app).post("/total-ads")
      .send(params)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        // HTTP status should be 200
        // console.log(res)
        res.status.should.equal(200);
        // Error key should be false.
        res.error.should.equal(false);
        done();

  });
});
});
describe('Add Items', () => {
  it('should get  url and ids', (done) => {
      request(app).post("/add-items")
      .send(params)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err,res){
        // HTTP status should be 200
        // console.log(res)
        res.status.should.equal(200);
        // Error key should be false.
        res.error.should.equal(false);
        done();
  });
});
});
describe('Scrape  URL', () => {
    it('should Scrape truck item', (done) => {
            request(app)
            .post("/scrape-truck-item")
            .send(params)
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
              // HTTP status should be 200
              res.status.should.equal(200);
              // Error key should be false.
              res.error.should.equal(false);
              done();
        })

 });
});