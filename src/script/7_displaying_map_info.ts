const GOOGLEMAPS_API_KEY = import.meta.env.PUBLIC_GOOGLEMAPS_API_KEY as string;
const GOOGLEMAPS_MAP_KEY = import.meta.env.PUBLIC_GOOGLEMAPS_MAP_KEY as string;
const mapElement = document.querySelector('#map');

declare global {
	interface Window {
		initMap: () => void;
	}
}

export function loadGoogleMaps(): Promise<google.maps.Map> {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEMAPS_API_KEY}&libraries=marker&callback=initMap`;

		script.async = true;
		script.onerror = () => reject('Google Maps failed to load');
		document.head.appendChild(script);

		window.initMap = () => {
			const mapElement = document.getElementById('map');
			if (mapElement) {
				const map = new google.maps.Map(mapElement, {
					center: { lat: 48.858222, lng: 2.2945 },
					zoom: 12,
					mapId: GOOGLEMAPS_MAP_KEY,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
				});

				map.addListener('click', function (event: any) {
					let contentString = '<div id="content"><p> Hello, I am Info Window<p/></div>';
					let infowindow = new google.maps.InfoWindow({ content: contentString });

					let marker = new google.maps.marker.AdvancedMarkerElement({
						position: event.latLng,
						map: map,
					});

					infowindow.open(map, marker);
				});

				resolve(map);
			} else {
				reject('Map element not found');
			}
		};
	});
}

if (mapElement) loadGoogleMaps().catch(console.error);
