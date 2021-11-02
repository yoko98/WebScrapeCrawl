//http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/
//https://stackoverflow.com/questions/2080381/guide-on-crawling-the-entire-web

var request = require('request');   //make HTTP requests
var cheerio = require('cheerio');   // parse and select HTML elements on the page
var URL = require('url-parse');     // parse URLs

var pagesVisited = {};
var pagesToVisit = [];
var numPagesVisited = 0;
var pgStart = 'https://warsi.or.id/id/program-kami/';
var MAX_PAGES_TO_VISIT = 10;

pagesToVisit.push(url);

var url = new URL(pgStart);     //**important
console.log("Page Visiting: " + pgStart);
crawlPage();


//a place to put all links found on each page with an array (pagesToVisit)
//keep track of pages visited - use a Set<String> / HashSet<String> that (pagesVisited)
//add the URL to the set when visited and the code will skip, make sure that the URL is not in the set
    
function crawlPage(){
    if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if(nextPage in pagesVisited){
    //crawl repeated after visitng the page
        crawlPage();
    }else{
        visitPage(url, crawlPage());
    }
}


function visitPage(url, callback){
    //Add page to set
    pagesVisited[url]=true;
    numPagesVisited++;
    //use the library request to visit the page, then execute a callback after we get the response 
    //callback is the anonymous function
    //in the function body - examine the response status code, 200 OK indicates that everything went ok
    request(pgStart, function(error, response, body){
        if(error && response.statusCode !== 200){
            console.log('Error: ' + error);
            callback();
            return;
        }
        //Check status code (200 is HTTP ok)
        console.log("Status Code: " + response.statusCode);
        if(response.statusCode == 200){
            //use cheerio to parse the page body and assign it to the variable $
            //cheerio helps use much of the functional;ity of jQuery to parse the page
            //Parse the document body
            //Parsing means analyzing and converting a program into an internal format that a runtime environment can actually run, for example the JavaScript engine inside browsers. The browser parses HTML into a DOM tree. ... If the document is well-formed, parsing it is straightforward and faster.
            var $ = cheerio.load(body);
            console.log('Page title: ' + $('title').text());    //to select the HTML element '<title>Page title</title>'and display the text within it
            console.log('Url Protocol: ' + url.protocol + '\nUrl Hostname: ' + url.hostname + '\nBase Url: ' + url.protocol + '//' + url.hostname);
            collectInternalLinks($);
            callback();
        }
    });
}


//parsing the page and searching for a word
//checking if a word is in the body of a webpage 
function searchWord($, word){
    var bodyText = $('html > body').text();
    if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1){  //to check for occurences of a substring in a given string; 'indexOf' is case sensitive, therefore both searchWord and webpage needs to be converted to either upper or lower case 
        return true;
    }else{
        return false;   
    }     
}

//collecting links on a webpage in Javascript
//two types of link on a webpage: hyperlinks such as relative paths / absolute paths
//relative paths = /information-technology/gadgets/security/tech-policy
//               = won't ever lead us away from the domain that we start on
//absolute paths = http://www.arstechnica.com/information-technology; http://www.arstechnica.com/gadgets; http://www.arstechnica.com/security; http://www.arstechnica.com/tech-policy; http://www.condenast.com; http://www.condenast.com/privacy-policy
//               = could take us anywhere on the internet
        
//gather all of the relative hyperlinks as well as the absolute hyperlinks for a given page
function collectInternalLinks($){
    //cannot mix both vars into one line just because its empty array
    //var allRelativeLinks = [];
    //var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function(){
        //allRelativeLinks.push($(this).attr('href'));
        pagesToVisit.push($(this).attr('href'));
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function(){
        //allAbsoluteLinks.push($(this).attr('href'));
        pagesToVisit.push($(this).attr('href'));
    }); 
    //console.log('Found: ' + allRelativeLinks.length + ' relative links.');
    //console.log('Found: ' + allAbsoluteLinks.length + ' absolute links.');
}


