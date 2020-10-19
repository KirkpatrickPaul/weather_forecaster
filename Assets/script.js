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
      $("#current-city").text(forecastData.current.name);
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
    });
    var currentDate = moment().format("MMMM Do YYYY");
    $("#current-card").attr("class", "card bg-secondary text-white");
    $("#current-city").attr("class", "card-header");
    $("#current-title").text("Weather Conditions on " + currentDate);
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
