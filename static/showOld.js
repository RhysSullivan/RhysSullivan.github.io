//converts css string to rgb values
function rgb2List(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
}

//use classes by initiating one like so:
class OldMatrix {
	constructor(canvasID, matrixJSON) {
    	//The constructor function is called with the new class
      	//instance's parameters, so this will be called like so:
      	//var classExample = new MyClass("FirstProperty's Value", ...)
      this.canvasID = canvasID;
      this.matrixJSON = matrixJSON;
      var c = document.getElementById(canvasID);
      this.ctx = c.getContext("2d");
    }
  setupColours_() {
    var colours = [];
    for(var i =0; i < 64; i++){
      var row = [];
      for(var j =0; j < 64; j++){
        row[j] = this.matrixJSON[i][j];
      }
      colours.push(row);
    }
    return colours;
  }

  draw(){
    var colours = this.setupColours_();
      for (var i = 0; i < 64; i++) {
        for (var j = 0; j < 64; j++) {
          // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
          // ctx.fillStyle = "#" + randomColor;
          //
          let r = colours[i][j][0];
          let g = colours[i][j][1];
          let b = colours[i][j][2];

          r = Math.floor(r/128);
          g = Math.floor(g/128);
          b = Math.floor(b/128);
          r *= 256;
          g *= 256;
          b *= 256;


          this.ctx.fillStyle = `rgb(${r},${g},${b})`;
          this.ctx.fillRect(i, j, 1, 1);
        }
    }
  }
}
