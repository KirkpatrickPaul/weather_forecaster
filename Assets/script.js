$(document).ready(function () {
  var cityString = localStorage.getItem("Cities");
  var cityID = [];
  if (cityString) {
    cityID = JSON.parse(cityString);
  }
  updateCities(cityID);
  function buildQueryURL() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=";
    var URL_Key = "7ecfb723466707858711a0159dd5300d";
    var cityQuery = "&q=" + $("#user-city").val().trim();
    return queryURL + URL_Key + cityQuery;
  }

  function updateCities(array) {
    $("#favorite-cities").empty();
    $(array).each(function (idx, elem) {
      var thisCity = $("<button>").text(elem.name).val(elem.id);
      if (idx === array.length - 1) {
        thisCity.attr("class", "btn btn-success btn-lg btn-block active");
      } else {
        thisCity.attr("class", "btn btn-lg btn-block btn-success");
      }
      thisCity.appendTo("#favorite-cities");
    });
    localStorage.setItem("Cities", JSON.stringify(array));
  }

  $("#new-city").on("submit", function (event) {
    event.preventDefault();
    var queryURL = buildQueryURL();
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (cityData) {
      var tester = true;
      var newCity = { name: cityData.name, id: cityData.id };
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
      $("#user-city").val("");
    });
  });
});
