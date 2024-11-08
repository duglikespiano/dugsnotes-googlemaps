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
					center: { lat: 30.031781, lng: 31.138962 },
					zoom: 12,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapId: GOOGLEMAPS_MAP_KEY,
				});

				let imageBounds = {
					north: 29.9855683264796,
					south: 29.969546254804,
					east: 31.1514759063721,
					west: 31.1183023452759,
				};

				let myImage = new google.maps.GroundOverlay('/src/images/pyramids.png', imageBounds);

				myImage.setMap(map);

				resolve(map);
			} else {
				reject('Map element not found');
			}
		};
	});
}

if (mapElement) loadGoogleMaps().catch(console.error);
