(function () {

  'use strict';

  let $stepsWrapper = $('#steps-wrapper');

  let currentStep = 1;

  var $body = $('body');
  $body.addClass('loading');

  var checkClickCount = 0
  var angle = 0;
  var droppables;
  var overlapThreshold = "95%";
  var ourDrags;
  var ourDragsArray = [];
  var dropAreas = [];
  var tempE = [];
  var items; 
  var fields = 
  [
    [ "fieldLines0.png", [ [ "magnetUp", 180 ] ], [ "ida0" ] ],
    [ "fieldLines1.png", [ [ "magnetUp", 0 ] ], [ "ida1" ] ],
    [ "fieldLines2.png", [ [ "magnetUp", 270 ] ], [ "ida2" ] ],
    [ "fieldLines3.png", [ [ "magnetUp", 90 ] ], [ "ida3" ] ],
    [ "fieldLines4.png", [ [ "magnetLo", 270 ] ], [ "ida4" ] ],
    [ "fieldLines5.png", [ [ "magnetLo", 90 ] ], [ "ida5" ] ],
    [ "fieldLines6.png", [ [ "magnetLo", 180 ] ], [ "ida6" ] ],
    [ "fieldLines7.png", [ [ "magnetLo", 0 ] ], [ "ida7" ] ],   
    [ "fieldLines8.png", [ [ "magnetUp", 270 ], [ "magnetUp", 90 ] ], [ "ida8left", "ida8right" ] ],
    [ "fieldLines9.png", [ [ "magnetUp", 270 ], [ "magnetUp", 270 ] ], [ "ida9left", "ida9right" ] ],
    [ "fieldLines10.png", [ [ "magnetUp", 90 ] ], [ "ida10" ] ],
    [ "fieldLines11.png", [ [ "magnetUp", 270 ] ], [ "ida11" ] ],
    [ "fieldLines12.png", [ [ "magnetUp", 0 ] ], [ "ida12" ] ],
    [ "fieldLines13.png", [ [ "magnetUp", 180 ] ], [ "ida13" ] ],
    [ "fieldLines14.png", [ [ "magnetLo", 270 ] ], [ "ida14" ] ],
    [ "fieldLines15.png", [ [ "magnetLo", 90 ] ], [ "ida15" ] ],
    [ "fieldLines16.png", [ [ "magnetLo", 180 ] ], [ "ida16" ] ],
    [ "fieldLines17.png", [ [ "magnetLo", 0 ] ], [ "ida17" ] ]
  ];

  init(); 

  function init(e) {
    items = shuffle(fields);
    loadSteps();
    loadTargets();
    $('.innerDropAreas').css('border', '2px solid brown');
    $('#steps-wrapper').addClass('step-1');
    $body.removeClass('loading');
  }; // init

  function loadSteps() {
    //load 5 random steps
    for( let l=0; l<5; l++) {
      $('#back-'+(l+1)).append("<img src='images/"+items[l][0]+"' alt='' />");
      let _temp0 = "<div class='magnets magnetUp-0 rot0' id='magnet-"+(l+1)+"-0'>";
      let _temp1 = "<div class='rotate-wrapper-up0 rotate-0'>";
      let _temp2 = "<img src='images/magnet1.jpg' alt=''>";
      let _temp3 = "</div></div>";
      let _sum = _temp0 + _temp1 + _temp2 + _temp3;
      $('#step-'+(l+1)).append(_sum);
      _temp0 = "<div class='magnets magnetLo-0 rot0' id='magnet-"+(l+1)+"-1'>";
      _temp1 = "<div class='rotate-wrapper-lo0 rotate-0'>";
      _temp2 = "<img src='images/magnet2.jpg' alt=''>";
      _temp3 = "</div></div>";
      _sum = _temp0 + _temp1 + _temp2 + _temp3;
      $('#step-'+(l+1)).append(_sum);

      _temp0 = "<div class='magnets hidden magnetUp-1 rot0' id='magnet-"+(l+1)+"-2'>";
      _temp1 = "<div class='rotate-wrapper-up1 rotate-0'>";
      _temp2 = "<img src='images/magnet1.jpg' alt=''>";
      _temp3 = "</div></div>";
      _sum = _temp0 + _temp1 + _temp2 + _temp3;
      $('#step-'+(l+1)).append(_sum);
      _temp0 = "<div class='magnets hidden magnetLo-1 rot0' id='magnet-"+(l+1)+"-3'>";
      _temp1 = "<div class='rotate-wrapper-lo1 rotate-0'>";
      _temp2 = "<img src='images/magnet2.jpg' alt=''>";
      _temp3 = "</div></div>";
      _sum = _temp0 + _temp1 + _temp2 + _temp3;
      $('#step-'+(l+1)).append(_sum);
      // rotatebutton - upper or lower - step - 0 or 1 (0 for default shown magnet, 1 for magnet hidden beneath by default)
      let _t0 = '<div class="rotateButton rotateButtonUpper-0" id="rotateButton-';
      let _t1 = (l+1)+'-0"></div>';
      $('#step-'+(l+1)).append(_t0 + _t1);
      _t0 = '<div class="rotateButton rotateButtonLower-0" id="rotateButton-';
      _t1 = (l+1)+'-1"></div>';
      $('#step-'+(l+1)).append(_t0 + _t1);
      _t0 = '<div class="rotateButton rotateButtonUpper-1 disabled" id="rotateButton-';
      _t1 = (l+1)+'-2"></div>';
      $('#step-'+(l+1)).append(_t0 + _t1);
      _t0 = '<div class="rotateButton rotateButtonLower-1 disabled" id="rotateButton-';
      _t1 = (l+1)+'-3"></div>';   
      $('#step-'+(l+1)).append(_t0 + _t1);     
      let _u0 = '<div class="checkButton disabled" id="checkButton-';
      let _u1 = (l+1)+'"></div>';
      $('#step-'+(l+1)).append(_u0 + _u1);
      $('.steps').addClass('active');
      $(".steps").removeClass('active');
      $('#step-1').addClass('active');

      createDraggable(l+1);
    }//for
  }//loadsteps function

  function loadTargets() {
    for( let l=0; l<5; l++) {
      for( let m=0; m<items[l][2].length; m++) {
        let _cur = items[l][2][m];
        let _u0 = '<div class="innerDropAreas wrong" data-target-magnet='+items[l][1][m][0]+' data-target-rotate='+items[l][1][m][1]+' id='+_cur+'></div>';
        $('#step-'+(l+1)).append(_u0);
      }
      // put dropareas into an array
      dropAreas.push(items[l][2]);
    }
  }

  function createDraggable(_step) {
    droppables = $('#step-'+_step+' .magnets');
    // console.log("droppables: ", droppables);
    // console.log("Dropareas: ", dropAreas);
    ourDrags = Draggable.create( droppables, {
      bounds: window,
      cursor: 'pointer',
      onPress: function() {
        // droppables = this.target;
        // console.log("droppables is: ", droppables);
        this.startX = this.x;
        this.startY = this.y;
        if(droppables.startX == undefined) {
          droppables.startX = this.x;
          droppables.startY = this.y;          
        }
        // ko je drugi magnet kliknjen se pac po potrebi doda class solved na .. droparea od prejsnjega magnetka
        let pluricagato = false;
        for( var i=0; i<dropAreas[_step-1].length; i++) { 
           if( $('#'+dropAreas[_step-1][i]).hasClass('solved')) {
              pluricagato = true;
            }
        }
        if(pluricagato == false) {
          var _draggedMagnet = $('#'+this.target.id);
          let _magnetEnding = this.target.id.substr(this.target.id.length-1);
          if(_magnetEnding == 2) {
            for( var i=0; i<dropAreas[_step-1].length; i++) { 
               if( $('#'+dropAreas[_step-1][i]).hasClass('correct')) {
              $('#'+dropAreas[_step-1][i]).addClass("solved");
             }
           }
          }
          else if( _magnetEnding == 3) {
            for( var i=0; i<dropAreas[_step-1].length; i++) { 
              if( $('#'+dropAreas[_step-1][i]).hasClass('correct')) {
                $('#'+dropAreas[_step-1][i]).addClass("solved");
              }
            }
          }
          else {}
        }

      },
      onDragStart: function(e) {
        // console.log('im inside onDragStart');
      },
      onDragEnd: function(e) 
      {
        var _draggedMagnet = $('#'+this.target.id);

        // console.log("this magnet x:", this.x, "this magnet y: ", this.y);
        // checking whether to enable the second magnet; enable it only if the user has moved the 1st magnet enough
        if( Math.abs(this.x - this.startX) > 6 || Math.abs(this.y - this.startX) > 6 ) {
          unhideCopyOfDraggedMagnet(_draggedMagnet);
          // if ( this is magnet nevemkaj ends with 2 or 3  then hide upper rotate button, to je button ending with -0 
          // and put class active to buttons ending with -1     
          let _magnetEnding = this.target.id.substr(this.target.id.length-1);
          let cristaccio = this.target.id.substr(0, this.target.id.length-1);
          // console.log("cristaccio: ", cristaccio, ' step je: ', _step);
          if(_magnetEnding == 2) {
            // dragged the copy of the original magnet, which means we re goiong to disable the 1st magnet
            // and to hide the upper rotate button
            // LTE MORAMO DISABLAT SAMO L.... BUTTONE IZ TEGA STEPA
            $('#rotateButton-'+_step+'-0').addClass('disabled');
            // $('#rotateButton-'+_step+'-2').addClass('active');
            $('#rotateButton-'+_step+'-2').removeClass('disabled');
            $('#'+cristaccio+'0').css('pointer-events', 'none');
            console.log('disabling magnet -0');
          }
          else if( _magnetEnding == 3) {
            $('#rotateButton-'+_step+'-1').addClass('disabled');
            // $('#rotateButton-'+_step+'-3').addClass('active');
            $('#rotateButton-'+_step+'-3').removeClass('disabled');
            $('#'+cristaccio+'1').css('pointer-events', 'none');
            console.log('disabling magnet -1');
          }
          else {}
        } //if

        // console.log("I m inside onDragEnd");
        tempE[currentStep-1] = e;
        // console.log('current step: ', currentStep, 'tempe: ', tempE);
        // console.log("onDragEnd magnetek: ", _draggedMagnet);
        // console.log('Adding class dropped to: ', _draggedMagnet);
        _draggedMagnet.addClass('dropped');
        $('#checkButton-'+currentStep).removeClass('disabled');
        // unhide the copy of this dragged magnet
        
        for( var i=0; i<dropAreas[_step-1].length; i++) {
          //for each droparea check hitHittest
          // console.log('checking hittest inside loop on: ', dropAreas[_step-1][i]);
          $('.magnets').css('box-shadow', '0 0 6px 3px greenyellow');

          if( this.hitTest( $('#'+dropAreas[_step-1][i]), overlapThreshold ) ) {
            // console.log("hittest TRUE");
            let _la = this.target.id.substr(this.target.id.length -1);
            let _inc = parseInt(_la) + 2;
            let _alb = this.target.id.slice(0, -1);
            let _new = _alb + _inc;
            $('#'+_new).removeClass('hidden');
          
            // napaka! tale corr rot je od taprve  innerDropAreas in ne od current. 
            let _corrMag = $('#step-'+_step+' .innerDropAreas').attr('data-target-magnet');
            let _corrRot = $('#'+dropAreas[_step-1][i]).attr('data-target-rotate');
            // let _corrRot = $('#step-'+_step+' .innerDropAreas').attr('data-target-rotate');

            $('#'+dropAreas[_step-1][i]).removeClass('wrong');
            var _res = checkDrop($(this.target),  _corrMag, _corrRot);
            // console.log("adding classs ", _res);
            $('#'+dropAreas[_step-1][i]).addClass(_res,  _corrMag, _corrRot);
            if( _res == 'correct') {
              // $(note).append('CORRECT');
              // console.log("adding class correct");
              // $('#'+dropAreas[_step-1][i]).addClass('solved');
            }
          }
          else {
            // console.log("hitTest FAILED");
            if( !$('#'+dropAreas[_step-1][i]).hasClass('solved')) { 
              $('#'+dropAreas[_step-1][i]).removeClass("correct solved");
              $('#'+dropAreas[_step-1][i]).addClass('wrong');
            }  
          }
        }//for
      } //onDragEnd
    });  //draggable.create
    ourDragsArray.push(ourDrags);
  }; //createDraggable

  $('.wrapper').on('click', '.checkButton', function() {
    checkClickCount++;
    let _allCorrect = true;
    
    let _thisStepDropArea = $('#step-'+currentStep).find('.innerDropAreas');
    console.log("this step dropareas: ", _thisStepDropArea.length);
    // here we need to see if number of moved magnets matches dropareas
    let _droppedMagnets = 0;
    if( $('#magnet-'+currentStep+'-0').hasClass("dropped") ) {
      _droppedMagnets++;
    }
    if( $('#magnet-'+currentStep+'-1').hasClass("dropped") ) {
      _droppedMagnets++;
    }
    if( $('#magnet-'+currentStep+'-2').hasClass("dropped") ) {
      _droppedMagnets++;
    }
    console.log("dropped magnets: ", _droppedMagnets);
    if( _droppedMagnets != _thisStepDropArea.length) {
      _allCorrect = false;
    }


    let _m = $('#step-'+currentStep).find('.magnets');  
    // console.log('Clicked on checkButton. Current dropareas: ', _thisStepDropArea);

    
    for( var g=0; g<_thisStepDropArea.length; g++) {
      droppables.startX = undefined;
      // console.log('_thisStepDropArea[g].id', _thisStepDropArea[g].id);
      if( !$('#'+_thisStepDropArea[g].id).hasClass('correct')) {
        _allCorrect = false;
      }
    }

    if( _allCorrect == true ) {
      // console.log("correct");
      disablePlay();
    }
    else {
      // console.log("wrong");
      _m.addClass('shakeAnimation');
      setTimeout( function() {
        _m.removeClass('shakeAnimation');
      }, 1500);
      TweenLite.to( $(".magnets"), 0.15, { x: 0, y: 0 });
      for( var g=0; g<_thisStepDropArea.length; g++) {
        // $(note).append("did this really happen? ");
        $('#'+_thisStepDropArea[g].id).removeClass('correct solved').addClass('wrong');
      }
      //remove dislabled class to respective upper rotate buttons
      $('#rotateButton-'+currentStep+'-0').removeClass('disabled');
      $('#rotateButton-'+currentStep+'-1').removeClass('disabled');  
      $('#rotateButton-'+currentStep+'-2').addClass('disabled');
      $('#rotateButton-'+currentStep+'-3').addClass('disabled');     
      $('#rotateButton-'+currentStep+'-2').removeClass('active');
      $('#rotateButton-'+currentStep+'-3').removeClass('active');         
      $('#magnet-'+currentStep+'-0').css('pointer-events', 'auto');
      $('#magnet-'+currentStep+'-0').removeClass('dropped');
      $('#magnet-'+currentStep+'-1').css('pointer-events', 'auto');
      $('#magnet-'+currentStep+'-1').removeClass('dropped');
      $('#magnet-'+currentStep+'-2').removeClass("active").addClass('hidden');
      $('#magnet-'+currentStep+'-3').removeClass("active").addClass('hidden');
      // $('.magnets').removeClass("rot90 rot180 rot270");
      // $('.magnets').addClass('rot0');
    }
    if(checkClickCount >= 5) {
      console.log("User run out of chances.");
      disablePlay();
    }
  });

  $('.wrapper').on('click', '.rotateButton', function() {
    // get which rotatebutton has been stepperClicked
    let _e = this.id.substr( this.id.length-3, this.id.length);
    //last char of this rotated magnet
    let _d = this.id.substr( this.id.length-1, 1);

    let $f = $('#magnet-'+_e);
    TweenLite.to( $f, 0.166, { rotation: '+=90'});
    if( $f.hasClass('rot90')) {
      $f.removeClass('rot90').addClass('rot180');
      $f.children().removeClass('rotate-90').addClass('rotate-180');
    }
    else if( $f.hasClass('rot180')) {
      $f.removeClass('rot180').addClass("rot270");
      $f.children().removeClass('rotate-180').addClass('rotate-270');
    }
    else if( $f.hasClass('rot270')) {
      $f.removeClass('rot270').addClass('rot0');
      $f.children().removeClass('rotate-270').addClass('rotate-0');
    }
    else {
      $f.removeClass('rot0').addClass("rot90");
      $f.children().removeClass('rotate-0').addClass('rotate-90');
    }
    // to make sure the use is not able to rotate the button again before the current rotating has ended
    $('.rotateButton').css('pointer-events', 'none');
    setTimeout( function() {
      $('.rotateButton').css('pointer-events', 'auto');
    }, 200);

    let _step = this.id.substr( this.id.length-3, 1);
    setTimeout( function() {
      ourDragsArray[_step-1][_d].startDrag(tempE[_step-1]);
      ourDragsArray[_step-1][_d].endDrag(tempE[_step-1]);      
    }, 400);
  });

  function checkDrop(_tar, _corrMag, _corrRot) {
    // console.log("Checking drop. Current magnet: ", _tar, 'correct magnet: ', _corrMag);
    let _msg = '';
    let _dropMag = 'magnetUp';
    let _dropRot;
    let _cl = ''; 
    if( _tar.hasClass('magnetLo-0') || _tar.hasClass('magnetLo-1') ) {
      _dropMag = 'magnetLo';
      // console.log("magnets Not matching");
      _msg+="magnets Not matching. ";
    }
    if( _dropMag == _corrMag) {
      // console.log("magnets matchihng");
      _msg+='magnets matching. ';
      let _rotation;
      if( _tar.hasClass('rot0')) {
        _rotation = 0;
      }
      else if( _tar.hasClass('rot90')) {
        _rotation = 90;
      }
      else if( _tar.hasClass('rot180')) {
        _rotation = 180;
      }
      else if( _tar.hasClass('rot270')) {
        _rotation = 270;
      }
      else {
        _msg+="something went wrong. ";
      }

      if( _rotation == _corrRot) {
        _msg+='All GOOD. returning CORRECT and disabling magnet click. ';
        // here we ll disable this magnet, it ll be sooner 
        // _tar.css({'pointer-events': 'none'});
        // console.log(_msg);
        return 'correct'; 
      }
      else {
        _msg+='rotation not matching. returning wrong. ';
        // console.log(_msg);
        return 'wrong';
      }
    }
    else {
      // console.log('returning wrong');
      _msg+='magnets not matching. returning wrong. ';
      // console.log(_msg);
      return 'wrong';
    }
  }

  function unhideCopyOfDraggedMagnet(mag) {

    // console.log('trying to copy: ', mag.attr('id'));
    var _r = mag.attr('id').substr( mag.attr('id').length -1);
    var _s = mag.attr('id').slice(0,-1);
    var _p = parseInt(_r) + 2;
    var _n = _s + _p;
    $('#'+_n).removeClass("hidden");
    // console.log('_r: ', _r, "_s", _s, "_p", _p, "_n", _n);
    var _m = _s.substr(_s.length-2, 1);
    // enableSecondRotateButton(_n, _m);

  }

  function disablePlay() {
    $('#step-'+currentStep).find('.magnets').css({ 'pointer-events': 'none'});
    $('#step-'+currentStep).find('.rotateButton').css({ 'pointer-events': 'none'}).addClass("disabled");
    $('#step-'+currentStep).find('.checkButton').css({ 'pointer-events': 'none'}).addClass("disabled");
  }

  function handleHit(dragObject, dropArea) {
    console.log("hit");
  };

  function handleMiss(drag) {
    var _drag = drag.target;
    TweenLite.to(_drag, 0.15, { x: drag.startX, y: drag.startY });
  };

  function temporarlyEnableVisibleWrapper() {
    $(invisibleWrapper).addClass('active');
    setTimeout( function() {
      $(invisibleWrapper).removeClass("active");
    }, 1000);
  }

  $(nextButton).on('click', function() {
     console.log(' currentstep before change: ' , currentStep)
      if( currentStep < 5) {
        currentStep++;
        console.log("New currentStep: ", currentStep);
       _handleStep(currentStep);        
      }
  });
  $(backButton).on('click', function() {
    console.log(' currentstep before change: ' , currentStep)
    if( currentStep > 1) {
        currentStep--;
        console.log("New currentStep: ", currentStep);
      _handleStep(currentStep);  
    }
  });


  function _handleStep(id) {
    $('.steps').removeClass("active");
    $('#step-'+id).addClass('active');      
    checkClickCount = 0;
  }
})();

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}





















