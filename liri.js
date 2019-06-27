// var Spotify = require("node-spotify-api");
// require("dotenv").config();

// var keys = require("./keys.js");
// //console.log(keys);

// var spotify = new Spotify({
//   id: keys.spotify.id,
//   secret: keys.spotify.secret
// });

// spotify.search({ type: "track", query: "All the Small Things" }, function(
//   err,
//   data
// ) {
//   if (err) {
//     return console.log("Error occurred: " + err);
//   }

//   require('util').inspect.defaultOptions.depth = 1;
//   console.log(data.tracks.items);
// });

require("dotenv").config();

var keys = require('./keys.js');
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var appCommand = process.argv[2];
console.log("appCommand: "+ appCommand);

var userSearch = process.argv.slice(3).join(" ");
console.log("userSearch: "+ userSearch);

function liriRun(appCommand,userSearch){
    switch(appCommand){
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "consert-this":
            getBandsInTown(userSearch);
            break;
        
        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getRandom();
            break;
        
        default:
        console.log("please enter one of the following commands:'spotify-this-song',' consert-this','movie-this','do-what-it-says'")
    }
}

function getSpotify(songName){
    var spotify = new spotify(keys.spotify);

    if(!songName){
        songName = "The Sign";
    };

    spotify.search({type: 'track', query: songName }, function(err,data){
        if(err){
            return console.log('Error occured:' + err);
        }

        console.log("=========================================");
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: "+ data.tracks.items[0].href + "\r\n");
        console.log("Album: "+ data.tracks.items[0].album.name + "\r\n");

        var logSong = "=====Begin Spotify Log Entry =====" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + 
                    "Song Name: " + data.tracks.items[0].name + "\n" + "Album: "+ data.tracks.items[0].album.name + "\n" ;

        fs.appendFile("log.txt", logSong, function(err){
            if (err) throw err;
        });
    });
};


function getBandsInTown(artist){
    var artist = userSearch;
    var brandQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(brandQueryUrl).then(
        function(response){
            console.log("=========================================");
            console.log("Name of the venue: " + response.data[0].venue.name +"\r\n");
            console.log("Venue Locatione: " + response.data[0].venue.city +"\r\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") +"\r\n");
            
            var logConcert = "=====Begin concert Log Entry =====" + "\nName of the Musician: " + artist + 
                    "Name of Venue: " + response.data[0].venue.name + "\n" + "Venue Location: "+ response.data[0].venue.city + "\n" 
                    "Date of event: "+ moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n" ;

                fs.appendFile("log.txt", logConcert, function(err){
                    if (err) throw err;
                });
    });
};

function getOMDB(movie){
    if(!movie){
        movie = "Mr. Nobody";
    }
 
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryUrl).then(
        function(response){
            console.log("=========================================");
            console.log("* Title: " + response.data.Title  +"\r\n");
            console.log("* Year Realesed: " + response.data.Year  +"\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating  +"\r\n");
            console.log("* Rotten Tomatos Rating: " + response.data.Ratings[1].Value  +"\r\n");
            console.log("* Country Where Produced: " + response.data.Country  +"\r\n");
            console.log("* Language: " + response.data.Language  +"\r\n");
            console.log("* Plot: " + response.data.Plot  +"\r\n");
            console.log("* Actors: " + response.data.Actors +"\r\n");

            var logMovie = "=====Begin Movie Log Entry =====" + "\nMovie Title: " + response.data.Title + 
                    "Year Realesed: " + response.data.Year  + "\n" + "IMDB Rating: "+ response.data.imdbRating + "\n" 
                    "Rotten Tomatos Rating: "+ response.data.Ratings[1].Value + "\n" + "Country Where Produced: "+ response.data.Country + "\n" +
                    "Language: "+ response.data.Language + "\n" + "Plot:  "+ response.data.Plot + "\n" +
                    "Actors: "+ response.data.Actors + "\n";

                fs.appendFile("log.txt", logMovie, function(err){
                    if (err) throw err;
                });

        });
};

function getRandom(){
    fs.readFile("random.txt", "utf8", function(err,data){
        if (err){
            return console.log(error);
        } else {
            console.log(data);

            var randomData = data.split(",");
            liriRun(randomData[0],randomData[1]);
        }
    });
};

function logResult(data){
    fs.appendFile("log.txt", data, function(err){
        if (err) throw err;
    });
};

liriRun(appCommand,userSearch);