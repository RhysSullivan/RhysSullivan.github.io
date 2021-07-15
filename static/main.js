$("#custom").spectrum({
  color: "#f00"
});
X_DIMENSION = 1280 / 8;
Y_DIMENSION = 720 / 8;
PIXEL_SIZE = 5;

var a = []
for (var i = 0; i < X_DIMENSION; i++) {
  row = []
  for (var j = 0; j < Y_DIMENSION; j++) {
    row.push([0, 0, 0])
  }
  a.push(row)
  row = []
}

var c = document.getElementById("myCanvas");
c.width = X_DIMENSION * PIXEL_SIZE;
c.height = Y_DIMENSION * PIXEL_SIZE;

var ctx = c.getContext("2d");
var x, y;
let isDrawing = false
var current_colour = rgb2List($("#selected").css("background-color"));
var colours = setupColours();
var col_to_update = [];

var outdated = false;

refreshGrid();

//assigns colours to grid
function fastRefresh() {  
  for (var index = 0; index < col_to_update.length; index++) {
    
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // ctx.fillStyle = "#" + randomColor;        
    i = col_to_update[index][0]
    j = col_to_update[index][1]
    r = col_to_update[index][2][0]
    g = col_to_update[index][2][1]
    b = col_to_update[index][2][2]
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
  }  
  outdated = false;
}

function refreshGrid() {
  for (var i = 0; i < X_DIMENSION; i++) {
    for (var j = 0; j < Y_DIMENSION; j++) {
      // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
      // ctx.fillStyle = "#" + randomColor;        
      let r = colours[i][j][0];
      let g = colours[i][j][1];
      let b = colours[i][j][2];
      r = Math.floor(r / 128);
      g = Math.floor(g / 128);
      b = Math.floor(b / 128);
      r *= 256;
      g *= 256;
      b *= 256;


      ctx.fillStyle = `rgb(${colours[i][j][0]},${colours[i][j][1]},${colours[i][j][2]})`;
      ctx.fillRect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
  outdated = false;

}

$('.colour').click(function (e) {
  if (this.id == "pink") {
    $("#selected").css("background-color", "#FF1493");
  }
  else if (this.id == "neon-blue") {
    $("#selected").css("background-color", "#00f3ff");
  }
  else {
    $("#selected").css("background-color", this.id);
  }

});

//converts css string to rgb values
function rgb2List(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
}

c.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
  getGrid();
});

c.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    x = e.offsetX;
    y = e.offsetY;
    draw(x, y);
    // sendData();
  }
});

c.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    draw(x, y);
    x = 0;
    y = 0;
    isDrawing = false;
    refreshGrid();
    sendData();
  }
});



function draw(x, y) {
  let row = Math.floor(x / PIXEL_SIZE);
  let col = Math.floor(y / PIXEL_SIZE);
  let new_col = rgb2List($("#selected").css("background-color"));
  if (row < X_DIMENSION && col < Y_DIMENSION) {
    colours[row][col] = new_col;
    var temp = [row, col, new_col];
    col_to_update.push(temp);
  }
  fastRefresh();
}

function sendData() {
  col_to_update = col_to_update.filter((ww = {}, a => !(ww[a] = a in ww)));
  if (!outdated) {
    $.ajax({
      url: URL_json,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      type: "post",
      data: {
        'colour': JSON.stringify(col_to_update),
        csrfmiddlewaretoken: window.CSRF_TOKEN
      },
      dataType: 'json',
      success: function (res, status) {
        // console.log(res);
        // console.log(status);
        for (let x = 0; x < col_to_update.length; x++) {
          let row = col_to_update[x][0];
          let col = col_to_update[x][1];
          let colour = col_to_update[x][2];
          colours[row][col] = colour;
        }
        refreshGrid();
        col_to_update = [];

      },
      error: function (res) {
        console.log(res.status);
      }
    });
  }
}

// function getColoursFromString(result){
//   return JSON.parse(result);
// }
function resetBoard() {
  $.ajax({
    url: URL_reset,
    type: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (result) {
      refreshBoard();
    }
  });
}
function setupColours() {
  var colours = [];
  for (var i = 0; i < X_DIMENSION; i++) {
    var row = [];
    for (var j = 0; j < Y_DIMENSION; j++) {
      row[j] = a[i][j];
    }
    colours.push(row);
  }
  return colours;
}

function getGrid() {
  if (isDrawing)
    return
  $.ajax({
    url: URL_refresh,
    type: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (result) {
      colours = result.leds;
      col_to_update = col_to_update.filter((ww = {}, a => !(ww[a] = a in ww)));
      for (let x = 0; x < col_to_update.length; x++) {
        let row = col_to_update[x][0];
        let col = col_to_update[x][1];
        let colour = col_to_update[x][2];
        colours[row][col] = colour;
      }
      refreshGrid();

    }
  });
}

var interval2 = setInterval(refreshBoard, 1000);
function refreshBoard() {
  getGrid();
}

getGrid()