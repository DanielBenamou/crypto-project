// LocalStorage =>
function DataSave(selectCoin) {
  localStorage.setItem("Coins", JSON.stringify(selectCoin));
}

function getData() {
  return JSON.parse(localStorage.getItem("Coins")) || [];
}

// all Vars =>
const myCoins = getData();;
let Data = [];
let latestSelectedCoin = "";
let chartsData = {};
let chart;

// displayCoins on home screen =>
$.ajax({
  url: "https://api.coingecko.com/api/v3/coins",
  success: (coins) => {
    Data = coins;
    displayCoinsList();
  },
    error: (err) => alert("the coin name is not valid" + err),
});
$(".coins").empty();

// Function of the Api display
function displayCoinsList() {
  const coins = Data;
  let myData = "";
  for (let i = 0; i < coins.length; i++) 
  {
    let checked = "";

    if (myCoins.indexOf(coins[i].symbol) !== -1) {
      checked = "checked";
    }
    myData += ` 
          <div class="card" style="width: 18rem;">
          <div class="card-body">
          <h5 class="card-title">${coins[i].name.toUpperCase()}</h5>
          <p class="card-text"> ${coins[i].id}</p>
          <label class="switch">
          <input type="checkbox" ${checked} onclick="myTog(this,'${coins[i].symbol}')">
          <span id="sliderCheck" class="slider round"></span>
          </label> 
          <a class="btn btn-dark" data-toggle="collapse" data-target="#collapseExample${i}" role="button" aria-expanded="false" aria-controls="collapseExample"> 
          Trade  
          </a>
          <br> <br>
          <a class="btn btn-light" data-toggle="collapse" data-target="#collapseExample${i}" role="button" aria-expanded="false" aria-controls="collapseExample">
          More Info   
          </a>
          
        <div class="collapse" id="collapseExample${i}">
        <div id="cardCollapse" class="card card-body">
          ${coins[i].market_data.current_price.usd} $ USD <br>
          ${coins[i].market_data.current_price.eur} € EURO <br>
          ${coins[i].market_data.current_price.ils} ₪ NIS <br> 
          <img src = "${coins[i].image.small}"${coins[i].image.small}>
        </div>
          </div> 
  
          </div>
          </div>
      
      `;
    $(".coins").html(myData);
    
  }


}

// the search button
$("#SeachIn").click(function (e) {
  e.preventDefault();
  let myHTML = "";
  const data = $("#myVal").val();
  if (data == "") {
    alert("You Need Search Something :)");
  } else {
    $.ajax({
      url: `https://api.coingecko.com/api/v3/search?query=${data}`,
      success: function (response) {
        if (response.coins.length === 0) {
          alert("Put Coin Name");
          return;
        }
        $.ajax({
          url: `https://api.coingecko.com/api/v3/coins/${response.coins[0].id}`,
          success: function (cards) {
            let checked = "";
            if (myCoins.indexOf(cards.symbol) !== -1) {
              checked = "checked";
            }

            $(".mycards").empty();
            myHTML += `
                  <div class="card cardpos row col-lg-4 col-12 d-inline-block text-center">
                  <div class="card-body">
                  <label class="switch">
                  <input type="checkbox" ${checked} onclick="myTog(this,'${cards.symbol}')">
                  <span class="slider round"></span>
                  </label>
                  <h5 class="card-title">${cards.name}</h5>
                  <hr>
                  <p class="card-text">${cards.symbol}</p>
                  <button class="btn btn-success" data-toggle="collapse" data-target="#collapseExample">More Info</button>
                  <div class="collapse" id="collapseExample">
                  <div style="  background-color: rgba(255, 193, 7, 0.944);
                  " class="card card-body images">
                  <img src="${cards.image.small}" alt="coinImg"> <br>
                  ${cards.market_data.current_price.eur} €<br>
                  ${cards.market_data.current_price.usd} $<br>
                  ${cards.market_data.current_price.ils} ₪<br>
              </div>
              </div>
              </div>
              </div>
          `;
            $(".coins").html(myHTML);
          },

          error: function () {
            alert("Cannot find this coin :( Try again");
          },
        });
      },
    });
  }
});

// about page
$("#about").click(async function () {
  const response = await fetch("about.html");
  const html = await response.text();
  $(".coins").html(html);//Stop Load
});


// live reports page
$("#liveReports").click(async function () {
  const response = await fetch("liveReports.html");
  const html = await response.text();
  $(".coins").html(html);
  Chart();
});



function myTog(el, symbol) {
  if (el.checked === true && myCoins.length === 1) {
    el.checked = false;
    latestSelectedCoin = symbol;
    let myHTML = "";
    for (let i = 0; i < myCoins.length; i++) {
      const currCoinSymbol = myCoins[i];
      const currCoin = Data.find((coin) => coin.symbol === currCoinSymbol);
      myHTML += `<div class="card col-12 col-md-6 col-lg-4 text-center" style="width: 18rem;">
            <div class="card-body">
                <label class="switch">
                <input type="checkbox" checked onclick="myTog(this,'${currCoin.symbol}'); displayCoinsList()">
                <span class="slider round"></span>
                </label>
                <h5 class="card-title">${currCoin.name}</h5>
                <hr>
                <p class="card-text">${currCoin.symbol}</p>
            </div>
        </div>`;
    }
    $(".modal-body").html(myHTML);
    $("#myModal").modal("show");
    return;
  }



  if (myCoins.includes(symbol)) {
    const index = myCoins.indexOf(symbol);
    myCoins.splice(index, 1);
  } else {
    myCoins.push(symbol);
  }
  DataSave(myCoins);
}

function onSaveModal() {
  if (latestSelectedCoin && myCoins.length < 5) {
    myCoins.push(latestSelectedCoin);
    localStorage.setItem("Coins", JSON.stringify(myCoins));
    latestSelectedCoin = "";
    displayCoinsList();
  }
}

const Chart = () => {
  $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myCoins.join(
      ","
    )}&tsyms=USD,EUR$api_key=767fcb4fa4f239d141bbc774069cb70c14971ad503b4f2e3f6c416ec37ed38b1`,
    success: (response) => {
      let chartData = [];
      for (let keys in response) {
        chartsData[keys] = {
          type: "spline",
          showInLegend: true,
          name: keys,
          yValueFormatString: "$#,##0",
          xValueFormatString: "MMM YYYY",
          dataPoints: [{ x: new Date(), y: response[keys].USD }],
        };
        chartData.push(chartsData[keys]);
      }
      const options = {
        animationEnabled: true,
        theme: "light",
        title: {
          text: "Live Reports"
        },
        axisY: {
          includeZero: false,
          prefix: "$",
          lineThickness: 0,
        },
        toolTip: {
          shared: true,
        },
        legend: {
          fontSize: 13,
        },
        data: chartData,
      };
      chart = new CanvasJS.Chart("chartContainer", options);
      chart.render();
      chartsInterval = setInterval(() => {
        updateChart();
      }, 1000);
    },
  });
};
function updateChart() {
  $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myCoins.join(
      ","
    )}&tsyms=USD,EUR$api_key=1729419b7ee89f52747993b9ac0870e1219c9694c627b1271607c6d2f85e85e4`,
    success: function (response) {
      let i = 0;
      for (let key in response) {
        const currCoin = response[key];
        chart.options.data[i].dataPoints.push({
          x: new Date(),
          y: response[key].USD,
        });
        i++;
      }
      chart.render();
    },
  });
}
