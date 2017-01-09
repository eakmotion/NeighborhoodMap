var markers = [];
var infoWindow;
var places = [
	{
		name: 'Wat Pra Kaeow',
		address: 'Na Phra Lan Rd, Phra Nakhon, Bangkok, Khwaeng Phra Borom Maha ' +
      'Ratchawang, Khet Phra Nakhon, Krung Thep Maha Nakhon 10200, Thailand'
	},
	{
		name: 'Bangkok National Museum',
		address: '4 Chao Fa Rd, Chana Songkhram, Khet Phra Nakhon, Krung Thep ' +
     'Maha Nakhon 10200, Thailand'
	},
	{
		name: 'Jim Thompson House',
		address: 'Rama I Rd, Khwaeng Wang Mai, Khet Pathum Wan, Krung Thep Maha ' +
      'Nakhon 10330, Thailand'
	},
	{
		name: 'Phra Pin Klao Bridge',
		address: 'Khwaeng Chana Songkhram, Khet Phra Nakhon, Krung Thep Maha ' +
      'Nakhon 10200, Thailand'
	},
	{
		name: 'Museum Siam',
		address: 'Thanon Sanam Chai, Khwaeng Phra Borom Maha Ratchawang, Khet ' +
      'Phra Nakhon, Krung Thep Maha Nakhon 10200, Thailand'
	},
	{
		name: 'Thammasat University (Tha Prachan Campus)',
		address: '12 Prachan Road Khwaeng Phra Borom Maha Ratchawang, Khet ' +
      'Phra Nakhon, Krung Thep Maha Nakhon 10200, Thailand'
	}
];

// Use Wikipedia API to search place information.
function getWikiInfo(place) {
  var wikiAPI = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='
    + place.name + '&format=json&callback=wiliCallback';

  $.ajax({
    url: wikiAPI,
    dataType: "jsonp",
    success: function(response) {
      var placeContent;
      var responseList = response[1];
      if (responseList.length > 0)
      {
        var url = response[3];
        var description = response[2]
        placeContent = '<div class="card info-window">' +
        '<div class="card-block">' +
        '<h5 class="card-title">' + place.name + '</h5>' +
        '<p class="card-text">' + description + '</p>' +
        '<div>This content is based on a Wikipedia article: <a href="' +
          url[0] + '" target="_blank">here</a></div></div></div>';
      }
      else
      {
        placeContent = '<div class="card info-window">' +
        '<div class="card-block">' +
        '<h5 class="card-title">' + place.name + '</h5>' +
        '<p class="card-text">Wikipedia content not found</p></div></div>';
      }
  		infoWindow.setContent(placeContent);
  		infoWindow.open(map, place.marker);
    }
  });
}

// Initialize Google map.
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
    scrollwheel: false,
		zoom: 14
	});
	infoWindow = new google.maps.InfoWindow();
	var geocoder = new google.maps.Geocoder();

	// Call pinAddress() on each place in the places array.
	places.forEach(function(place) {
		pinAddress(geocoder, map, place);
	});
	ko.applyBindings(new ViewModel());
}

// pinAddress() converts addresses into geographic coordinates
// and place markers accordingly.
function pinAddress(geocoder, map, place) {
	var address = place.address;
	geocoder.geocode({'address': address}, function(results, status) {
		if (status === 'OK') {
      var image = '/img/Thailand-icon.png';
			map.setCenter(results[0].geometry.location);
			place.marker = new google.maps.Marker({
				map: map,
        icon: image,
				animation: google.maps.Animation.DROP,
				position: results[0].geometry.location
			});

			// Wikipedia API will get call when a marker was clicked
			google.maps.event.addListener(place.marker, 'click', function() {
				getWikiInfo(place);
				toggleBounce(place.marker);
			});

			markers.push({
				name: place.name,
				marker: place.marker
			});

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

// Marker bounce
function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 1400);
	}
}

// Open marker info window.
function clickedMarker(name) {
	markers.forEach(function(markerItem) {
		if (markerItem.name == name) {
			google.maps.event.trigger(markerItem.marker, 'click');
		}
	});
}

// Create ViewModel.
var ViewModel = function() {
	var self = this;
	this.filter = ko.observable("");

	// Filter places based on search.
	this.filteredPlaces = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if (!filter) {
			places.forEach(function(place) {
				if (place.marker) {
					place.marker.setVisible(true);
				}
			});
			return places;
		} else {
			return ko.utils.arrayFilter(places, function(place) {
		 		var searchValue = place.name.toLowerCase().indexOf(filter) !== -1;
		 		if (searchValue) {
		 			place.marker.setVisible(true);
		 		} else {
		 			place.marker.setVisible(false);
		 		}
		 		return searchValue;
		 	});
		}
	});
};
