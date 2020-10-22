$(document).ready(function () {
  var URL_KEY = "7ecfb723466707858711a0159dd5300d";
  var cityString = localStorage.getItem("Cities");
  var cityID = [];
  if (cityString) {
    cityID = JSON.parse(cityString);
  }
  updateCities(cityID);

  function buildCityURL() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=";
    var cityQuery = "&q=" + $("#user-city").val().trim();
    return queryURL + URL_KEY + cityQuery;
  }
  // I probably don't need the 2 build URL functions, but I wanted to make it easy to modify or update in a single place.
  //CityURL is mostly to get the coordinates at this point, then CoordURL is where I get all my actual information.
  function buildCoordURL(coordObj) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&appid=";
    var Citylat = "&lat=" + coordObj.lat;
    var Citylon = "&lon=" + coordObj.lon;
    return queryURL + URL_KEY + Citylat + Citylon;
  }
  // updateCities makes the buttons on the sidebar. It's called when the page is loaded or a new city is searched.
  function updateCities(array) {
    $("#favorite-cities").empty().text();
    $(array).each(function (idx, elem) {
      var thisCity = $("<button>").text(elem.name).val(elem.name);
      if (idx === array.length - 1) {
        thisCity.attr("class", "btn btn-success btn-lg btn-block");
      } else {
        thisCity.attr("class", "btn btn-lg btn-block btn-success");
      }
      thisCity.appendTo("#favorite-cities");
    });
    localStorage.setItem("Cities", JSON.stringify(array));
  }
  //renderWeather has to call a new ajax function so that it can get UVI information and the 5-day forecast.
  function renderWeather(coordObj) {
    var queryURL = buildCoordURL(coordObj);
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (forecastData) {
      $("#current-city").text(cityID[cityID.length - 1].name);
      var weatherIcon =
        "http://openweathermap.org/img/wn/" +
        forecastData.current.weather[0].icon +
        "@2x.png";
      $("#current-conditions").html(
        '<img src="' +
          weatherIcon +
          '" alt="Current Weather Icon"/> <p>Temperature: ' +
          forecastData.current.temp +
          "°F</p> <p>Humidity: " +
          forecastData.current.humidity +
          "%RH</p> <p>Wind Speed: " +
          forecastData.current.wind_speed +
          " MPH</p>"
      );
      var $index = $("<p>").text("UV Index: ");
      var UVI = forecastData.current.uvi;
      if (UVI < 3) {
        $("<span>")
          .text(UVI)
          .attr("class", "badge badge-success")
          .appendTo($index);
      } else if (UVI < 5) {
        $("<span>")
          .text(UVI)
          .attr("class", "badge badge-warning")
          .appendTo($index);
      } else {
        $("<span>")
          .text(UVI)
          .attr("class", "badge badge-danger")
          .appendTo($index);
      }
      $index.appendTo("#current-conditions");
      for (var j = 1; j <= 5; j++) {
        var forecastCard = $("<div>")
          .attr("class", "card text-white")
          .attr(
            "style",
            "background-color: #" +
              (7 - j) +
              "" +
              (7 - j) +
              "8" +
              (7 - j) +
              "" +
              (7 - j) +
              "" +
              (4 + j)
          );
        var loopDate = moment().add(j, "d").format("dddd");
        var dayIcon =
          "http://openweathermap.org/img/wn/" +
          forecastData.daily[j].weather[0].icon +
          "@2x.png";
        $("<h6>").text(loopDate).appendTo(forecastCard);
        $("<p>")
          .text("High: " + forecastData.daily[j].temp.max)
          .appendTo(forecastCard);
        $("<p>")
          .text("Low: " + forecastData.daily[j].temp.min)
          .appendTo(forecastCard);
        $("<img>")
          .attr("src", dayIcon)
          .attr("alt", "Day " + j + " Forecast Icon")
          .appendTo(forecastCard);
        $("<p>")
          .text("Humidity: " + forecastData.daily[j].humidity)
          .appendTo(forecastCard);
        forecastCard.appendTo("#forecast" + j);
      }
    });
    var currentDate = moment().format("dddd MMMM Do, YYYY");
    $("#current-card")
      .attr("class", "card text-white col-md-10")
      .attr("style", "background-color: #888888");
    $("#current-city").attr("class", "card-header");
    $("#current-title").text("Weather Conditions Right Now on " + currentDate);
  }

  $("#new-city").on("submit", function (event) {
    event.preventDefault();
    var queryURL = buildCityURL();
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (cityData) {
      var tester = true;
      var newCity = {
        name: cityData.name,
        lat: cityData.coord.lat,
        lon: cityData.coord.lon,
      };
      // This for loop keeps duplicates out of the favorite cities list.
      for (var i = 0; i < cityID.length; i++) {
        if (cityID[i].name === newCity.name) {
          tester = false;
          $("#user-city").val("");
          return;
        }
      }
      if ((tester = true)) {
        cityID.push(newCity);
        updateCities(cityID);
      }
      renderWeather(newCity);
      $("#user-city").val("");
    });
  });
  $("#favorite-cities").on("click", function (event) {
    if (event.target.matches("button")) {
      var city = event.attr("value");
    }
    console.log(city);
  });
});
