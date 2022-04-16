const express = require("express");
const app = express();
app.set("view engine", "hbs");
const urlencodedParser = express.urlencoded({ extended: false });
const XMLHttpRequest = require('xhr2');

app.get("/", function(request, response) {
    response.render("home");
});

app.post("/search", urlencodedParser, function(request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
    let movieName = request.body.name;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://imdb-api.com/en/API/Search/k_fwceib6v/${movieName}`);

    xhr.send();
    let data;

    xhr.onload = function() {
        data = JSON.parse(xhr.responseText);
        console.log(data);

        response.render("posters", {
            "results": data.results
        });
    };
});

app.post(["/topmovies", "/soon", "/intheaters", "/a/b/a"], urlencodedParser, function(request, response) {
    let xhr = new XMLHttpRequest();

    let path = request.path;
    if (path == "/topmovies") {
        xhr.open('GET', `https://imdb-api.com/en/API/Top250Movies/k_fwceib6v`);
    } else if (path == "/soon") {
        xhr.open('GET', `https://imdb-api.com/en/API/ComingSoon/k_fwceib6v`);
    } else if (path == "/intheaters") {
        xhr.open('GET', `https://imdb-api.com/en/API/InTheaters/k_fwceib6v`);
    } else {
        response.sendStatus(404);
    }


    xhr.send();
    let data;

    xhr.onload = function() {
        data = JSON.parse(xhr.responseText);
        // console.log(data);

        response.render("posters", {
            "results": data.items
        });
    };
});

app.listen(3000, () => console.log("Сервер запущен..."));