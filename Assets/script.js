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
  function buildCoordURL(coordObj) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&appid=";
    var Citylat = "&lat=" + coordObj.lat;
    var Citylon = "&lon=" + coordObj.lon;
    return queryURL + URL_KEY + Citylat + Citylon;
  }

  function updateCities(array) {
    $("#favorite-cities").empty().text();
    $(array).each(function (idx, elem) {
      var thisCity = $("<button>").text(elem.name).val(elem.name);
      if (idx === array.length - 1) {
        thisCity.attr("class", "btn btn-success btn-lg btn-block");
        // how do I make this button stop being active if something else is clicked?
        // .toggleClass("active");
      } else {
        thisCity.attr("class", "btn btn-lg btn-block btn-success");
      }
      thisCity.appendTo("#favorite-cities");
    });
    localStorage.setItem("Cities", JSON.stringify(array));
  }

  function renderWeather(coordObj) {
    var queryURL = buildCoordURL(coordObj);
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (forecastData) {
      console.log(forecastData);
      $("#current-city").text(forecastData.name);
      var currentDate = moment().format("MMMM Do YYYY");
      var weatherIcon =
        "http://openweathermap.org/img/wn/" +
        forecastData.weather[0].icon +
        "@2x.png";
      $("#current-title").text("Weather Conditions on " + currentDate);
      $("#current-conditions").html(
        '<img src="' +
          weatherIcon +
          ' alt="Current Weather Icon"/> <p>Temperature: ' +
          forecastData.main.temp +
          "°F</p> <p>Humidity: " +
          forecastData.main.humidity +
          "%RH</p> <p>Wind Speed: " +
          forecastData.wind.speed +
          " MPH</p>"
      );
      var $index = $("<p>").text("UV Index: ");
      var UV = $index.appendTo("#current-conditions");
    });
    $("#current-card").attr("class", "card");
    $("#current-city").attr("class", "card-header");
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
});
