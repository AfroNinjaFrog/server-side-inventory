var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/myproject';

// view engine setup
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
/*
// Query Functions

// GET Queries
// Get image by company then name
var GetImageByCompAndName = function(db,Comp,Name, callback) {
  var collection = db.collection('Images');
  collection.find({Name:Name, Company:Comp}).toArray(function(err, ImageJSON) {
    assert.equal(err, null);
    callback(ImageJSON);
  });
}

// Get function
app.get('/item/:Company/:Name', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server with query: Company=" + req.params.Company  + " Name=" + req.params.Name);
  
    GetImageByCompAndName(db,req.params.Company,req.params.Name, function(docs) {
      db.close();
      res.send(docs);
    });
  });
});
*/
// Get all the physical machines

var GetTable = function( db, table, callback) {
  var collection = db.collection(table);
  collection.find({}).toArray(function(err, qCollection) {
    assert.equal(err, null);
    callback(qCollection);
  });
}
app.get('/Equipment/:equip', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server with query: Get this table - " + req.params.equip);
  
    GetTable(db, req.params.equip, function(docs) {
      db.close();
      res.send(docs);
    });
  });
})

module.exports = app;
  