require("dotenv").config();
let keys = require("./keys.js");
let fs = require("fs");
let Spotify = require('node-spotify-api');
let axios = require('axios');
let moment = require('moment');

let spotify = new Spotify(keys.spotify);

let liriReturn = process.argv[2];
let search = process.argv.slice(3).join(" ");
let movieSearch = process.argv.slice(3).join("+");

//Switch identfies which type of search -------------------------
switch (liriReturn) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
/// default text that comes up when you type in node liri.js 
    default: console.log(
        "\n" + "type any command after 'node liri.js': " + "\n" +
        "concert-this 'any artist'  " + "\n" +
        "spotify-this-song 'any song title' " + "\n" +
        "movie-this 'any movie title' " + "\n" +
        "do-what-it-says " + "\n" +
        "Use quotes for multiword titles!");
};
//Concert - bands in town functionality-----------------------------
function concertThis() {
    axios
        .get("http://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp")
        .then(function (response) {
            let concert = {
                Band: response.data[0].lineup[0],
                Venue: response.data[0].venue.name,
                Location: response.data[0].venue.city + ", " + response.data[0].venue.country,
                Date: moment(response.data[0].datetime).format("MM DD YYYY")
            }
            console.log(concert);
            fs.appendFileSync('log.txt', '\n' + JSON.stringify(concert));
        
        })
        .catch(function(err){
            console.log("Error occurred: " + err);
        });
};
//spotify - song functionality-------------------------------------

function spotifyThisSong(){
    if(search == " "){
        search = 'The sign Ace of Base';
        spotify
        .search({type: 'track', query: search, limit: 1})
        .then(function(response){
            let song = {
                Artist: response.tracks.items[0].artists[0].name,
                SongName: response.tracks.items[0].name,
                Preview: response.tracks.items[0].preview_url,
                Album: response.tracks.items[0].album.name
            }
            console.log(song);
            fs.appendFileSync('log.txt', '\n' + JSON.stringify(song));
        })
        .catch(function(err){
            console.log("Error occurred" + err);
        })
    }
    else{
        spotify
        .search({type: 'track', query: search, limit: 1})
        .then(function(response){
            let song = {
                Artist: response.tracks.items[0].artists[0].name,
                SongName: response.tracks.items[0].name,
                Preview: response.tracks.items[0].preview_url,
                Album: response.tracks.items[0].album.name
            }
            console.log(song);
            fs.appendFileSync('log.txt', '\n' + JSON.stringify(song));
        })
        .catch(function(err){
            console.log("Error occurred" + err);
        })
    }
}
//OMDB functionality-----------------------------------------------------

function movieThis(){
    if(movieSearch == " "){
        axios
        .get("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy")
        .then(function (response) {
        let movie = {
            Title: response.data.Title,
            Year: response.data.Year,
            'IMDB Rating': response.data.Ratings[0].Value,
            'Rotten Tomatoes Rating': response.data.Ratings[1].Value,
            'Production Country': response.data.Country,
            Language: response.data.Language,
            Plot: response.data.Plot,
            Actors: response.data.Actors
        }
            console.log(movie);
            fs.appendFileSync('log.txt', '\n' + JSON.stringify(movie));
        })
        .catch(function(err){
            console.log("Error occurred: " + err);
        })
    }
    else {
        axios
            .get("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy")
            .then(function (response) {
            let movie = {
                Title: response.data.Title,
                Year: response.data.Year,
                'IMDB Rating': response.data.Ratings[0].Value,
                'Rotten Tomatoes Rating': response.data.Ratings[1].Value,
                'Production Country': response.data.Country,
                Language: response.data.Language,
                Plot: response.data.Plot,
                Actors: response.data.Actors
            }
                console.log(movie);
                fs.appendFileSync('log.txt', '\n' + JSON.stringify(movie));
            })
            .catch(function(err){
                console.log("Error occurred: " + err);
            })

    }
}
/// Do what is says Function----------------------
function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(error, data){

        if (error){
            return console.log(error);
        }
        
        let dataArr = data.split(",");  
    
        command = dataArr[0];

        if (command == "movie-this"){
            movieSearch = dataArr[1];
            movie();
        }
        else if (command == "concert-this"){
            search = dataArr[1];
            concert();
        }
        else {
            search = dataArr[1];
            spotifyThisSong();
        }
    }); 
}
    

