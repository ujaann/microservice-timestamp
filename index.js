// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date?", function (req, res, next) {
  // console.log(req.params.date,typeof(req.params.date));

  /**
   * Since the dates sent by fcc: 12424252453 (only digits/epoch)  &&  2016-03-29 (digits And -)  &&
   * 05 october 2011, GMT	(words And space)   &&   this-is-not-a-date	(words and -)  &&  undefined
   * we can see the only digits part needs to be parsed to INT so we parse to INT if it is not undefined and
   * matches the regex for only digits. then we leave as is for others
   */

  const date_Or_epoch = req.params.date ?    //undefined returns false
    /^\d+$/.test(req.params.date) ? parseInt(req.params.date)
      : req.params.date : req.params.date;
  req.dateToParse = new Date();

  // console.log(req.params.date,date_Or_epoch);


  /**
   * If the date turned out to be undefined we use the current time stamp else we try to convert
   * the given date
  */
  if (date_Or_epoch) {
    req.dateToParse = new Date(date_Or_epoch);
  }
  next();
}, function (req, res) {

  /**
   * Incase of this-is-not-a-date we see that it is an invalid date so we do this
   * using isNaN function to check the value of dates and return json accordingly
  */

  if (isNaN(req.dateToParse.valueOf())) {
    res.json({
      error: "Invalid Date"
    });
  }
  else {
    res.json({
      unix: req.dateToParse.valueOf(),
      utc: req.dateToParse.toUTCString(),
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


