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
var oldX = -1000;
var oldY = -1000;
var brushType = 1
c.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  switch (brushType) {
    case 1:
      isDrawing = true;
      getGrid();
      break;
    case 2:
      x = Math.floor(x / PIXEL_SIZE);
      y = Math.floor(y / PIXEL_SIZE);
      new_col = rgb2List($("#selected").css("background-color"));
      old_col = colours[x][y];
      ff_nr(x, y, old_col, new_col)
      break;
  }
});
function chooseBrush(type) {
  brushType = type;
  bb = document.getElementById('brush')
  bub = document.getElementById('bucket')
  switch (brushType) {
    case 1:
      bb.className = "selected"
      bub.className = "notselected"
      break;
    case 2:
      bb.className = "notselected"
      bub.className = "selected"
      break;
  }
}
function colMatch(colA, colB) {
  return colA[0] == colB[0] && colA[1] == colB[1] && colA[2] == colB[2]
}

function flood_fill_nr(pos_x, pos_y, target_color, color, depth) {

  if (pos_y < 0 || pos_x < 0 || pos_x >= X_DIMENSION || pos_y >= Y_DIMENSION || depth > 10000) // if there is no wall or if i haven't been there
  {
    return false;                                              // already go back
  }

  oldCol = colours[pos_x][pos_y]
  if (!colMatch(oldCol, target_color)) // if it's not color go back  
  {
    return false;
  }
  if (colMatch(oldCol, color)) {
    return false;
  }
  colours[pos_x][pos_y] = color;
  var temp = [pos_x, pos_y, color];
  col_to_update.push(temp);
  return true;
}

function ff_nr(pos_x, pos_y, target_color, color) {
  q = []
  q.push([pos_x, pos_y])
  while (q.length > 0) {
    coords = q.pop()
    x = coords[0]
    y = coords[1]

    if (flood_fill_nr(x + 1, y, target_color, color))
      q.push([x + 1, y])
    if (flood_fill_nr(x, y + 1, target_color, color))
      q.push([x, y + 1])
    if (flood_fill_nr(x - 1, y, target_color, color))
      q.push([x - 1, y])
    if (flood_fill_nr(x, y - 1, target_color, color))
      q.push([x, y - 1])
  }
  sendData();
}


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
    oldX = -1000;
    oldY = -1000;
    isDrawing = false;
    refreshGrid();
    sendData();
  }
});



function draw(x, y) {
  let row = Math.floor(x / PIXEL_SIZE);
  let col = Math.floor(y / PIXEL_SIZE);
  let new_col = rgb2List($("#selected").css("background-color"));
  x = row
  y = col
  atPos = false
  while (!atPos) {
    atPos = true
    if (oldX == -1000 || oldY == -1000) {
      oldY = y;
      oldX = x
    }
    else {
      switch (1) {
        case 1:
          if (oldX != x) {
            atPos = false
            oldX += -Math.sign(oldX - x)
          }

          if (oldY != y) {
            atPos = false
            oldY += -Math.sign(oldY - y)
          }
          break;
        case 2:
          xDelta = Math.abs(oldX - x)
          yDelta = Math.abs(oldY - y)
          console.log(xDelta)
          console.log(yDelta)
          if (oldX != x) {
            if (xDelta < yDelta || xDelta == yDelta) {
              atPos = false
              oldY += -Math.sign(oldY - y)
            }
          }
          if (oldY != y) {
            if (yDelta < xDelta || xDelta == yDelta) {
              atPos = false
              oldX += -Math.sign(oldX - x)
            }
          }
          break;
      }
    }
    if (oldX < X_DIMENSION && oldY < Y_DIMENSION) {
      colours[oldX][oldY] = new_col;
      var temp = [oldX, oldY, new_col];
      col_to_update.push(temp);
    }
    else {
      break;
    }
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
