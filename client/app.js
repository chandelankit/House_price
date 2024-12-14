var globalPrice;
var conversionRate;
var selectedCurr;
var dollarRate;

function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i in uiBathrooms) {
      if(uiBathrooms[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }
  
  function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for(var i in uiBHK) {
      if(uiBHK[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }
  
  function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");

    var url = "https://house-price-2mfe.onrender.com/predict_home_price";

    return $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }).then(function(data) {
        globalPrice = data.estimated_price;
        document.getElementById("uiEstimatedPrice").innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
        return data.estimated_price;
    });
}

function fetchConversionRate() {
    var url = "https://v6.exchangerate-api.com/v6/3209a9e3f1d4e9c87ad70e7d/latest/USD";
    selectedCurr = document.getElementById('uiCurrency').value;
    
    return $.get(url).then(function(data) {
        conversionRate = data.conversion_rates[selectedCurr]
        dollarRate = data.conversion_rates.INR
        return conversionRate;
    });
}

function priceInDollars() {
    Promise.all([onClickedEstimatePrice(), fetchConversionRate()])
        .then(function([price, rate]) {
            var estdollar = document.getElementById("uiDollarPrice");
            console.log(rate)
            console.log(dollarRate)
            estdollar.innerHTML = "<h2>"+ selectedCurr + " "+ ((price * 100000)/dollarRate) * rate + "</h2>";
        })
        .catch(function(error) {
            console.error("Error occurred:", error);
        });
}


function onPageLoad() {
    console.log( "document loaded" );
    var url = "https://house-price-2mfe.onrender.com/get_location_names";
    var url1 = "https://v6.exchangerate-api.com/v6/3209a9e3f1d4e9c87ad70e7d/latest/USD"
    $.get(url,function(data, status) {
        console.log("got response for get_location_names request");
        if(data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for(var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
            var newopt = new Option("Choose A location")
            newopt.selected = true;
            $('#uiLocations').append(newopt);
        }
    });
    $.get(url1,function(data, status) {
      console.log(data)
        if(data) {
            var currencies = data.conversion_rates;
            var keys = Object.keys(currencies)
            $('#uiCurrency').empty();
            for(var i in keys) {
                var opt = new Option(keys[i]);
                $('#uiCurrency').append(opt);
            }
            var newopt = new Option("Choose A Currency")
            newopt.selected = true;
            $('#uiCurrency').append(newopt);
        }
    });
  }

window.onload = onPageLoad;