function Basket(selector, options) {
  var startObject = options.startObject;
  var normalObject = options.normalObject;
  var finishObject = options.finishObject;
  var startOnClick = options.startOnClick;
  var finishOnClick = options.finishOnClick;
  var closeOnClick = options.closeOnClick;

  this.selector = selector;
  this.startObject = startObject;
  this.normalObject = normalObject;
  this.finishObject = finishObject;
  this.startOnClick = startOnClick;
  this.finishOnClick = finishOnClick;
  this.closeOnClick = closeOnClick;

  this.places = [];
  this.start = null;
  this.end = null;
}

Basket.prototype.redraw = function() {
  var $this = this;
  var selector = this.selector;
  var startObj = this.startObj;
  var normObj = this.normObj;
  var finObj = this.finObj;

  $(selector).find(this.startObject).remove();
  $(selector).find(this.normalObject).remove();
  $(selector).find(this.finishObject).remove();

  var places = this.places.filter(function(place) {
    let state = true;
    if ($this.start) {
      state = place._id == $this.start._id ? false : true;
    }
    if (state && $this.end) {
      state = place._id == $this.end._id ? false : true;
    }
    return state;
  });

  if (this.end) {
    placeObj = finObj.clone();
    placeObj.attr('data-place', this.end._id);
    placeObj.find('.label-in-div').text(this.end.title);
    $(selector).prepend(placeObj);
  }

  places = places.reverse();
  places.forEach(function(place) {
    placeObj = normObj.clone();
    placeObj.attr('data-place', place._id);
    placeObj.find('.label-in-div').text(place.title);
    $(selector).prepend(placeObj);
  });

  if (this.start) {
    placeObj = startObj.clone();
    placeObj.attr('data-place', this.start._id);
    placeObj.find('.label-in-div').text(this.start.title);
    $(selector).prepend(placeObj);
  }

  $('[data-toggle="popover"]').popover();

  //add event listener
  $(selector).show();
};

Basket.prototype.init = function() {
  var $this = this;
  $.ajax({
    url: '/basket',
    method: 'GET',
  }).done(function(res) {
    $this.start = res.start;
    $this.end = res.end;
    $this.places = res.places;
    $this.redraw();
  });

  this.startObj = $(this.selector).find(this.startObject).clone();
  this.normObj = $(this.selector).find(this.normalObject).clone();
  this.finObj = $(this.selector).find(this.finishObject).clone();

  $(document).on('click', this.startOnClick, function(e) {
    var popover = $(e.target).closest('.popover');
    var place = $('[aria-describedby=' + popover.attr('id') + ']').parent().attr('data-place');
    $this.updateBasket({ start: place });
  });
  $(document).on('click', this.finishOnClick, function(e) {
    var popover = $(e.target).closest('.popover');
    var place = $('[aria-describedby=' + popover.attr('id') + ']').parent().attr('data-place');
    $this.updateBasket({ end: place });
  });

  $(document).on('click', this.closeOnClick, function(e) {
    var place = $(e.target).parent().attr('data-place');
    $this.deletePlace({ place: place });
  });

};

Basket.prototype.deletePlace = function(data) {
  var $this = this;
  var place = data.place;
  $.ajax({
    url: '/basket/places/' + place,
    method: 'DELETE',
  }).done(function(res) {
    $this.start = res.start;
    $this.end = res.end;
    $this.places = res.places;
    $this.redraw();
  });
};

Basket.prototype.updateBasket = function(data) {

  var $this = this;
  var start = data.start;
  var end = data.end;
  var place = data.place;

  $.ajax({
    url: '/basket',
    method: 'PUT',
    data: {
      start: start,
      end: end,
      place: place,
    },
  }).done(function(res) {
    if( res.error ) {
      window.location.href = '/login';
    } else {
      $this.start = res.start;
      $this.end = res.end;
      $this.places = res.places;
      $this.redraw();
    }
  });
};
