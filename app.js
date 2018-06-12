var fs = require('fs');
var express = require('express');
var cors = require('cors');
var conversion = require('phantom-html-to-pdf');

var app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('pdf'));

app.get('/', function(req, res) {
    res.setHeader("content-type", "application/json");
    res.json({"message": "Everything is OK"});
});

app.get('/generate', function(req, res, next) {
  
    var targetUrl = req.query.url
    var fullUrl = req.protocol + '://' + req.hostname ;
   
    // handle the form that is submitted to this page.
    var conversion = require("phantom-html-to-pdf")();
    conversion({
        numberOfWorkers: 2,
        tmpDir: __dirname+'/public',
        phantomPath: require("phantomjs-prebuilt").path,
        url: targetUrl
    }, function(err, pdf) {

        if(err) console.log(err);

        console.log(pdf.logs);
        console.log(pdf.numberOfPages);

        var fileName = generateFileName();
        var fileLink = fullUrl + "/" + fileName;

        res.setHeader("content-type", "application/json");

        var output = fs.createWriteStream(__dirname+'/pdf/'+ fileName);
        pdf.stream.pipe(output);
        res.json({link: fileLink});
       

    });
})


function generateFileName() {

    var r = Math.floor(Math.random()*2000000)
    return `${r}.pdf`;
}

app.listen(port, function() {
    console.log("Running on port " + port);
});