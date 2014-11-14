$( document ).ready(function() {
   // Create canvas object:
  var canvas = document.getElementById('my-canvas');
  var context = canvas.getContext('2d');
  var imageObj = new Image();
  var variance = 1;
  var rowSampleFrequency = variance;
  var colSampleFrequency = variance;
  var wiggleHeight = variance / 2;
  var xyArray = [];
  var imgWidth = 131;
  var imgHeight = 104;
  var imageOffsetX = 10;
  var imageOffsetY = 10;
  var imgSrc = 'images/img2.png';


  imageObj.onload = function() {
    context.drawImage(imageObj, imageOffsetX, imageOffsetY);
    // now iterate through pixels


    var posY = imageOffsetY;
    var colCount = 1;
    var farsideOffset = (imageOffsetX + imgWidth) % rowSampleFrequency;
    
    //iterate through the image back and forth for each line
    for (var posY = imageOffsetY; posY < imgHeight; posY += colSampleFrequency) {
      
      //colCount tracks iterations for modulus switching
      colCount++;
      
      //cycle through each pixel across (skipping by rowSampleFrequency)
      for (var posX = imageOffsetX; posX < imgWidth; posX += rowSampleFrequency) {
        var xScan = colCount % 2 == 0 ? posX : ((imageOffsetX + imgWidth) - farsideOffset) - posX
        var imgd = context.getImageData(xScan, posY, 1, 1);
        var pix = imgd.data;
        xyArray = xyArray.concat(generateBump(xScan, posY, pix));
      }

    }


    // see it in the console:
    //console.log(xyArray);

    // generate SVG polyline: (proof of concept)
    $("svg").find("polyline").attr("points", xyArray.join(" "));

    //make that gcode
    generateGcode(xyArray);

  };
  imageObj.src = imgSrc;

  //===== function definitions ======
  function generateBump(x, y, pixel) {

    x = truncateToNdecimals(x, 3);
    y = truncateToNdecimals(y, 3);

    //average RGB values
    var colorAvg = (pixel[0] + pixel[1] + pixel[2]) / 3;
    // set wiggle height (limit to 5 decimal places)

    var wiggle = truncateToNdecimals((wiggleHeight - (wiggleHeight * colorAvg / 255)), 5);
    var isDark = wiggle > wiggleHeight / 2;
    var rand = Math.random() > 0.5 ? 1 : -1;
    // return center, top, bottom, and center again (for reset)
    returnArr = [x, y];
    if (isDark) {
      returnArr.push(
              x + wiggle * rand,
          truncateToNdecimals(y - wiggle, 3),
              x - wiggle * rand,
          truncateToNdecimals(y + wiggle, 3),
          x, y
      );
    }

    return returnArr;
  }

  function generateGcode(array) {
    var gcode = [];
    //destructive, because who cares at this point...
    var ecount = 0;
    var iterator = 0.00001;
    while (array.length) {
      gcode.push("G1 X" + array.shift() + " Y" + array.shift() + " E" + truncateToNdecimals(ecount += iterator, 6));
    }
    ;
    $("#my-gcode").text(gcode.join("\n"));
  }
  ;
  function truncateToNdecimals(num, decimals) {
    var mult = Math.pow(10, decimals);
    return Math.round(num * mult) / mult;
  }
});
 