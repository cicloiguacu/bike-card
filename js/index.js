var canvas = new fabric.Canvas('canvas', {backgroundColor: '#FFFFFF'});
var fonts = ['Roboto', 'Roboto Condensed', 'Allura', 'Dancing Script', 'Reenie Beanie', 'Parisienne', 'Lovers Quarrel'];
var selectedFont = fonts[0];
var text = 'Marca/Modelo/Cor';
var text2 = 'local da ocorrência\ninfos complementares';
var text3 = '20 SET';
var textYear = '2018';
var textStatus = 'ALERTA'
var textObject = null;
var textObject2 = null;
var imgBikeInstance = null;
var infoStatusInstance = null;
var infoActionInstance = null;
var infoStatusOkInstance = null;
var infoStatusFInstance = null;
var canvasHeight = 690;
var groupText = null;
var infoDate = null;
var importData = {};

/*importData = {
  'infoText': 'Caloi 10 branca',
  'infoText2': 'info complementar',
  'infoDate': '14/05/2017',
  'infoStatus': '2',
  'infoPhoto': 'bike04.png',

}*/

WebFont.load({
  classes: false,
  google: {
    families: fonts },

  active: function active() {
    $('select').append(fonts.map(function (font) {return '<option style="font-family: ' + font + '">' + font + '</option';}));

    loadCanvas();

    canvas.on('object:moving', function (e) {
        var obj = e.target;

         // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();

        if (obj._element.id == 'base01' || obj._element.id == 'base02') {
          if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
              obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
              obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
          }
          if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
              obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
              obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
          }

        }
    });

    generateImage();

  }
});


$('#input-a').on('change paste keyup', function () {
  text = $(this).val();
  //textObject.text = text;
  var p = groupText.getObjects();
  //p[0].text = text;
  textObject.set('text',text);
  console.log(p[0]);
  canvas.renderAll();
  generateImage();
});
$('#input-b').on('change paste keyup', function () {
  text2 = $(this).val();
 // textObject2.text = text2;
  textObject2.set('text',text2);
  var p = groupText.getObjects();
  p[1].text = text2;
  canvas.renderAll();
  generateImage();
});

$('#input-c').on('change paste keyup', function () {
  //text3 = $(this).val();
  //infoDateDayInstance.text = text3;
  console.log('update');
  infoDate = getDateInfo(text3);
  textYear = infoDate[2];
  dd = text3.slice(0,2)+' '+infoDate[1];
  console.log(dd);
  //infoDateDayInstance.text = dd;
  //infoDateYearInstance.text = infoDate[2];
  var textos = groupText.getObjects();
  console.log(textos);

  infoDateDayInstance.set('text',dd);
  infoDateYearInstance.set('text',infoDate[2]);
  textos[2].text = dd;
  textos[3].text = infoDate[2];

  canvas.renderAll();
  generateImage();
}).on('blur', function () {
  updatePosition();
});

$('select').on('change', function () {
  selectedFont = this.value;
  generateImage();
});

$('#input-date').datepicker(
  {
    format: 'dd/mm/yyyy',
    todayHighlight: true,
    autoclose: true
});

$('#input-date').on('change paste keyup', function () {
  text3 = $(this).val();
  infoDate = getDateInfo(text3);
  textYear = infoDate[2];
  var dd = text3.slice(0,2)+' '+infoDate[1];
  console.log(dd);
  //infoDateDayInstance.text = dd;
  //infoDateYearInstance.text = infoDate[2];
  var textos = groupText.getObjects();
  console.log(textos);
  infoDateDayInstance.set('text',dd);
  infoDateYearInstance.set('text',infoDate[2]);
  textos[2].text = dd;
  textos[3].text = infoDate[2];
  canvas.renderAll();
  generateImage();
});


$('#generate').on('click', function () {
  updatePosition();
  canvasHeight = infoActionInstance.get('top') + (infoActionInstance.get('height') * infoActionInstance.get('scaleY'));
  var dataURL = canvas.toDataURL({
        width: 420,
        height: canvasHeight
    });
  canvas.setHeight(canvasHeight);
  //$('#image-result').attr('width','420').attr('height',t);
  generateImage();
});

$('#generate2').on('click', function () {

  var p = imgBikeInstance.get('top') + (imgBikeInstance.get('height') * imgBikeInstance.get('scaleY'));
  infoStatusOkInstance.set({top:p, opacity:1});
  infoStatusInstance.set({top:p});
  p = infoActionInstance.get('top') + (infoActionInstance.get('height') * infoActionInstance.get('scaleY'));
  //groupText.set({top:p+20});
  //canvas.add(infoStatusOkInstance);
  //canvas.destroy(infoStatusInstance);
  infoStatusInstance.set('opacity',0);
  generateImage();
});

$('#info-status-options a').on('click', function () {
  $('#info-status-options a').removeClass('active').attr('aria-pressed',false);
  $(this).addClass('active').attr('aria-pressed',true);
  var k = $(this).attr('data-value');
  console.log(k);
  //var p = $(this).attr('data-value');
  setStatus(k);

  /*var p = imgBikeInstance.get('top') + (imgBikeInstance.get('height') * imgBikeInstance.get('scaleY'));
  infoStatusOkInstance.set({top:p, opacity:1});
  infoStatusInstance.set({top:p});
  p = infoActionInstance.get('top') + (infoActionInstance.get('height') * infoActionInstance.get('scaleY'));*/
  //groupText.set({top:p+20});
  //canvas.add(infoStatusOkInstance);
  //canvas.destroy(infoStatusInstance);
  //infoStatusInstance.set('opacity',0);
  updatePosition();
});

$('#cards-list a').on('click', function () {
  var info = {};
  info.infoText = $(this).attr('data-infoText');
  info.infoText2 = $(this).attr('data-infoText2');
  info.infoDate = $(this).attr('data-infoDate');
  info.infoStatus = $(this).attr('data-infoStatus');

/*importData = {
  'infoText': 'Caloi 10 branca',
  'infoText2': 'info complementar',
  'infoDate': '14/05/2017',
  'infoStatus': '2'
}*/
  updateInfos(info);

});



// -- FUNCTIONS

function generateImage(text) {
  var png = getPNGDataURLFromString();
  $('#image-result').attr('src', png);
  $('#image-result-link').attr('href', png);
}

function loadCanvas() {
  canvas.clear();
  canvas.setHeight(690);
  canvas.setWidth(420);
  canvas.backgroundColor = '#FFFFFF';

  textObject = new fabric.Text(text, {
    fontSize: 22,
    fontWeight: 'bold',
    left:82,
    top: 344,
    width:324,
    fontFamily: selectedFont
  });


  textObject2 = new fabric.Text(text2, {
    fontSize: 14,
    fontFamily: selectedFont,
    left:82,
    top: 370,
    width:324,
    lineHeight:1
  });

  infoDateDayInstance = new fabric.Text(text3, {
    fontSize: 20,
    fontFamily: selectedFont,
    fontWeight: 'bold',
    left:-10,
    top: 346
  });
  //infoDateDayInstance.width = 80;

  infoDateYearInstance = new fabric.Text(textYear, {
    fontSize: 14,
    fontFamily: selectedFont,
    left:18,
    top: 370
  });
  //infoDateYearInstance.width = 80;


  /*canvas.add(textObject);
  canvas.add(textObject2);*/
  //canvas.add(infoDateDayInstance);

  // Footer / Actions
  imgElement2 = document.getElementById('base02');
  //var retang = new fabric.Rect({ width:500, height:500, left:0, top:200, fill: 'red' });
  infoActionInstance = new fabric.Image(imgElement2, {
    left:0,
    top:500/*,
    clipPath: retang,
    angle: 30,
    opacity: 0.85*/
  });
  infoActionInstance.scaleToWidth(420);
  //infoActionInstance.clipPath = clipPath;
  canvas.add(infoActionInstance);
  /*var groupA = new fabric.Group([infoActionInstance]);
  groupA.clipPath = clipPath;
  canvas.add(groupA);*/


  // BIKE PHOTO
  var imgBike = document.getElementById('bike');
  imgBikeInstance = new fabric.Image(imgBike, {
    left:0,
    top:0
  });
  imgBikeInstance.scaleToWidth(420);
  canvas.add(imgBikeInstance);

  // STATUS ALERTA
  imgElement = document.getElementById('base01');
  p = imgBikeInstance.get('top') + (imgBikeInstance.get('height') * imgBikeInstance.get('scaleY'));
  infoStatusInstance = new fabric.Image(imgElement, {
    left:0,
    top:p,
    opacity: 0
  });
  infoStatusInstance.scaleToWidth(420);
  canvas.add(infoStatusInstance);

  // STATUS FURTADA
  var imgStatusF = document.getElementById('base02d');
  infoStatusFInstance = new fabric.Image(imgStatusF, {
    left:0,
    top:p,
    opacity: 1
  });
  infoStatusFInstance.scaleToWidth(420);
  canvas.add(infoStatusFInstance);

  // STATUS RECUPERADA
  imgElement3 = document.getElementById('base03');
  infoStatusOkInstance = new fabric.Image(imgElement3, {
    left:0,
    top:p,
    opacity: 0
  });
  infoStatusOkInstance.scaleToWidth(420);
  canvas.add(infoStatusOkInstance);

  // INFOS TEXTOS
  p = infoStatusInstance.get('top') + (infoStatusInstance.get('height') * infoStatusInstance.get('scaleY')) + 4;
  vP = p - 10;
  var vertBar = new fabric.Rect({ width:3, height:90, left:68, top:vP, fill: '#e6e6e6' });
  groupText = new fabric.Group([ textObject, textObject2, infoDateDayInstance, infoDateYearInstance, vertBar], {left:-54,
  top: p, width: 462});
  canvas.add(groupText);

  //canvas.selection = false;

  //updatePosition();

}

function getPNGDataURLFromString() {
  var dataURL = canvas.toDataURL({
      //width: textObject.getLineWidth(0) + 20,
      //height: textObject.getHeightOfLine(0) + 30 });
      width: 420,
      height: canvasHeight
  });
  return dataURL;
}

function getDateInfo(a) {
  var monthDesc = a.slice(3,5);
  if (monthDesc == '01') {
    monthDesc = 'JAN';
  } else if (monthDesc == '02') {
    monthDesc = 'FEV';
  } else if (monthDesc == '03') {
    monthDesc = 'MAR';
  } else if (monthDesc == '04') {
    monthDesc = 'ABR';
  } else if (monthDesc == '05') {
    monthDesc = 'MAI';
  } else if (monthDesc == '06') {
    monthDesc = 'JUN';
  } else if (monthDesc == '07') {
    monthDesc = 'JUL';
  } else if (monthDesc == '08') {
    monthDesc = 'AGO';
  } else if (monthDesc == '09') {
    monthDesc = 'SET';
  } else if (monthDesc == '10') {
    monthDesc = 'OUT';
  } else if (monthDesc == '11') {
    monthDesc = 'NOV';
  } else if (monthDesc == '12') {
    monthDesc = 'DEZ';
  }
  var dateInfos = [a.slice(0,2),monthDesc,a.slice(6,10)];
  return dateInfos;
}

var span = document.querySelector('#span');
span.onchange = function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(file) {
        replaceImage(file.target.result);
    }
    reader.readAsDataURL(file);
}

function replaceImage(imgLink) {
  fabric.Image.fromURL(imgLink, function(img) {
    imgBikeInstance.setSrc(imgLink, function(){
      canvas.renderAll();
    });
  });
}

function updatePosition() {
  imgBikeInstance.scaleToWidth(420);

  p = imgBikeInstance.get('top') + (imgBikeInstance.get('height') * imgBikeInstance.get('scaleY'));
  infoStatusInstance.set('top',p);
  infoStatusFInstance.set('top',p);
  infoStatusOkInstance.set('top',p);

  p = infoStatusInstance.get('top') + (infoStatusInstance.get('height') * infoStatusInstance.get('scaleY')) + 4;
  groupText.set('top',p);

  p = groupText.get('top') + groupText.get('height') + 4;
  infoActionInstance.set('top',p);

  canvas.renderAll();
  generateImage();
}

function updateInfos(data) {
  if (data) {
    importData.infoText = data.infoText;
    importData.infoText2 = data.infoText2.replace(/\\n/g,"\n");
    importData.infoDate = data.infoDate;
    importData.infoStatus = data.infoStatus;
    importData.infoPhoto = data.infoPhoto;
  }

  textObject.set('text',importData.infoText);
  textObject2.set('text',importData.infoText2);

  infoDate = getDateInfo(importData.infoDate);
  textYear = infoDate[2];
  var dd = importData.infoDate.slice(0,2)+' '+infoDate[1];
  infoDateDayInstance.set('text',dd);
  infoDateYearInstance.set('text',infoDate[2]);

  setStatus(importData.infoStatus);

  /*imgBikeInstance.setSrc(importData.infoPhoto, function(){
    canvas.renderAll();
  });*/
 // replaceImage(importData.infoPhoto);


  updatePosition();
  canvas.renderAll();generateImage();
}

function setStatus(k) {
  if (k == 0) {
    infoStatusFInstance.set({opacity:1});
    infoStatusOkInstance.set({opacity:0});
    infoStatusInstance.set({opacity:0});
  } else if (k == 1) {
    infoStatusFInstance.set({opacity:0});
    infoStatusOkInstance.set({opacity:0});
    infoStatusInstance.set({opacity:1});
  } else if (k == 2) {
    infoStatusFInstance.set({opacity:0});
    infoStatusOkInstance.set({opacity:1});
    infoStatusInstance.set({opacity:0});
  }
}

function importImage(e){
   var reader = new FileReader();
   reader.onload = function (event) { 
      var imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function () {
          var image = new fabric.Image(imgObj);
          image.set({
              //left: 250,
              //top: 250,
              angle: 0,
              padding: 5,
              cornersize: 10
          });
          image.filters.push(new fabric.Image.filters.Resize({scaleX: 0.2, scaleY: 0.2}));
          image.applyFilters(canvas.renderAll.bind(canvas));
          canvas.add(image);

      }
  }
  reader.readAsDataURL(e);
}