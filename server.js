// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars')
var logger = require('morgan');

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

//Listen on port 8080
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Morgan and Bodyparser
app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
  extended: false
}));

// Handlebars
app.engine('handlebars', hbs({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

// Models
var Article = require('./models/Article.js');
var Comment = require('./models/Note.js');


// Database Configuration
mongoose.connect('mongodb://localhost/pgaScrape');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Routes

// Main route
app.get('/', function(req, res) {
  request('http://www.pgatour.com/news.html', function (error, response, body) {
     var $ = cheerio.load(body);
    $(".inner-text").each(function(i, element) {

      var articleTitle = $(this).children("h4").text();
      var articleLink = $(this).children("a").attr("href");
      var insertedArticle = new Article({
        title : articleTitle
       });
      //saving titles to robomongo
      insertedArticle.save(function(err, dbArticle) {
        if (err) {
          console.log(err);
        } else {
          console.log(dbArticle);
        }
      });
    });
    res.sendFile(process.cwd() + './public/index.html')
  });
});

app.get('/pga_title', function(req, res) {

  Article.find({}, function(err, articleData) {
    if(err) {
      throw err;
    }
    res.json(articleData);
  }).limit(15);
});

app.post("/submit", function(req, res){
  var newComment = new Comment({
    commentBody: req.body.commentBody});

  newComment.save(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      Article.findOneAndUpdate({"_id": req.body.articleId},{$push: {'comments': doc._id}}, {new: true}, function(err, articleData) {
        if(err) {
          throw err;
        }else {
          res.sendFile(process.cwd() + './public/index.html');
        }
      });
      Comment.findOneAndUpdate({"_id": doc._id},{$set: {'_articleId': req.body.articleId}}, function(err, articleData) {
        if(err) {
          throw err;
        }else {
          res.sendFile(process.cwd() + './public/index.html');
        }
      });
    }
  });
});


// Listen on port 8080
app.listen(PORT, function(){
  console.log('Listening on port ' + PORT);
})