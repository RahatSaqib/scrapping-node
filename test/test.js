const cors = require("cors");
const bodyParser = require("body-parser");
const request = require('supertest');
const app =  require( "../app");
var should = require("should");
describe('Get Next Page URL', () => {
    it('should get next url', (done) => {
        request(app).get("/next-url")
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
      request(app).get("/total-ads")
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
      request(app).get("/add-items")
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
            .get("/scrape-truck-item")
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