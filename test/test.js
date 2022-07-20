const express = require('express');
const chai = require('chai');
const request = require('supertest');
const app = express();
var should = require("should");
var server = request.agent("http://localhost:8443");
describe('Get Next Page URL', () => {
    it('should get next url', (done) => {
        server
        .get("/next-url")
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          // HTTP status should be 200
          res.status.should.equal(200);
        //   // Error key should be false.
          res.error.should.equal(false);
          done();
         // more validations can be added here as required
    });
 });
});
describe('Scrape  URL', () => {
    it('should Scrape truck item', (done) => {
        return new Promise((resolve,reject)=>{
            server
            .get("/scrape-truck-item")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
              // HTTP status should be 200
              res.status.should.equal(200);
            //   // Error key should be false.
              res.error.should.equal(false);
              resolve (done());
             // more validations can be added here as required
        })

    });
 });
});