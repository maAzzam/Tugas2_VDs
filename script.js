let dataBar = []; //buat variabel global
let dataPie = [2756, 234,435,5456]; //supaya jadi variabel global
let colors = ['red','green', 'blue', 'grey','yellow']; //untuk pieplot
let url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN4nLYEakWVA8n7aTmvG9oBd1ODR6r-wW8LBweV-_2p_N2spBUkeycL_0DudLFqLvqF8-SxfMxxh1M/pub?output=csv';
let dataSheet;

let xData;
let yData;
let dataWeather; // tambahkan variabel global untuk menyimpan data cuaca
let urlAPI="https://api.openweathermap.org/data/2.5/weather?q=Lampung&appid=64dfb2dfafd2fe576427dbfc0db0212f&units=metric";

function preload(){ 
  dataSheet = loadTable(url, 'csv', 'header'); 
}

function linePlot(xData, yData){ 
  var maxX = max(xData); 
  var minX = min(xData); 
  var maxY = max(yData); 
  var minY = min(yData); 
  var w = (windowWidth/2) / (xData.length-1); 
  for (var i=0; i < xData.length; i++){ 
    var x1 = map(xData[i], minX, maxX, 0, windowWidth/2 ); 
    var x2 = map(xData[i+1], minX, maxX, 0, windowWidth/2 ); 
    var y1 = map(yData[i], minY, maxY, 0, windowHeight/2 ); 
    var y2 = map(yData[i+1], minY, maxY, 0, windowHeight/2 ); 
    line(i*w, windowHeight - y1, (i+1)*w, windowHeight - y2); 
    ellipse(i*w, windowHeight - y1, 10, 10) 
  } 
} 

function barPlot(dataBar){ 
  stroke(0,255,0); 
  fill('blue');  
  var maxBar = max(dataBar); 
  var w = (windowWidth/2) / dataBar.length; 
  for (var i=0; i<dataBar.length;i++){ 
    var dat = map(dataBar[i], 0, maxBar, 0, windowHeight/2 ) 
    rect(i*w, windowHeight/2 - dat, w, dat) 
  } 
} 

function persentase(arr){ 
  var tot = 0; 
  for (var i=0; i<arr.length;i++){ 
    tot = tot + arr[i] 
  } 
  var per = [] 
  for (var i=0; i<arr.length;i++){ 
    per[i] = arr[i] / tot 
  } 
  return per 
} 

function piePlot(dataPie){ 
  let diameter = windowHeight / 3; 
  let lastAngle = 0; 
  var dataPer = persentase(dataPie); 
  strokeWeight(4); 

  for (let i = 0; i < dataPer.length; i++) { 
    var angles = dataPer[i] * 360; 
    fill(colors[i]) 
    arc( 
      windowWidth * 3 / 4, 
      windowHeight * 1 / 4, 
      diameter, 
      diameter, 
      lastAngle, 
      lastAngle + radians(angles) 
    ); 
    lastAngle += radians(angles); 
  } 
} 

function setup() { 
  createCanvas(windowWidth, windowHeight);   
  for (var i = 0; i < 100; i++){ 
    dataBar[i] = random(0,100);
  } 

  xData = dataSheet.getColumn('x');
  yData = dataSheet.getColumn('y');
} 

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
} 

function draw() { 
  background(20) 
  stroke(255,255,255) 
  strokeWeight(1); 
  line(windowWidth/2, 0, windowWidth/2, windowHeight) 
  line(0, windowHeight/2, windowWidth, windowHeight/2) 
  barPlot(dataBar);
  piePlot(dataPie);
  linePlot(xData, yData);
  loadWeatherData(); // memuat data cuaca
  drawWeatherInfo(); // menampilkan informasi cuaca
} 

function loadWeatherData() {
  loadJSON(urlAPI, gotWeatherData);
}

function gotWeatherData(data) {
  dataWeather = data;
}

function drawWeatherInfo() {
  if (dataWeather) {
    fill(255);
    textSize(14);
    textAlign(CENTER); // Mengatur teks menjadi rata tengah
    let temperatureText = "Temperature: " + dataWeather.main.temp + "°C";
    let humidityText = "Humidity: " + dataWeather.main.humidity + "%";
    let descriptionText = "Description: " + dataWeather.weather[0].description;

    // Menghitung tinggi total teks
    let totalTextHeight = 20 + 20 + 20 + 20;

    // Mengatur posisi y agar teks berada di tengah kotak keempat
    let yPosition = (windowHeight / 2) + ((windowHeight / 2 - totalTextHeight) / 2);

    // Menampilkan teks
    text("Weather Information:", windowWidth * 3 / 4, yPosition);
    text(temperatureText, windowWidth * 3 / 4, yPosition + 20);
    text(humidityText, windowWidth * 3 / 4, yPosition + 40);
    text(descriptionText, windowWidth * 3 / 4, yPosition + 60);
  }
}