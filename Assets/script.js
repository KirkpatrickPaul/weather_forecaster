function buildQueryURL() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=";
  var URL_Key = "7ecfb723466707858711a0159dd5300d";
  var cityQuery = "&q=" + $("#user-city").val().trim();
  return queryURL + URL_Key + cityQuery;
}
// console.log("api.openweathermap.org/data/2.5/weather?units=imperial&appid=");

$("#new-city").on("submit", function (event) {
  event.preventDefault();
  var queryURL = buildQueryURL();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (cityData) {
    console.log(cityData);
  });
});
