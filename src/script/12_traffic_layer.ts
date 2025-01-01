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
		script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEMAPS_API_KEY}&libraries=visualization&callback=initMap`;

		script.onerror = () => reject('Google Maps failed to load');
		document.head.appendChild(script);

		window.initMap = () => {
			const mapElement = document.getElementById('map');
			if (mapElement) {
				const map = new google.maps.Map(mapElement, {
					center: { lat: 37.7749, lng: -122.4194 },
					zoom: 13,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapId: GOOGLEMAPS_MAP_KEY,
				});
				const trafficLayer = new google.maps.TrafficLayer();
				console.log(trafficLayer);
				trafficLayer.setMap(map);
			} else {
				reject('Map element not found');
			}
		};
	});
}

if (mapElement) loadGoogleMaps().catch(console.error);
