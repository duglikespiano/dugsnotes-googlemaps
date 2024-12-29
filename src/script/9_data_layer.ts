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
				{
					let geojson_URL = 'https://datahub.io/core/geo-countries/r/countries.geojson';
					let promise = $.getJSON(geojson_URL);
					promise.then(function (data) {
						for (let i = 0; i < data.features.length; i++) {
							if (data.features[i].properties.ADMIN == 'Egypt') map.data.addGeoJson(data.features[i], { idPropertyName: 'id' });
						}
					});
				}
			} else {
				reject('Map element not found');
			}
		};
	});
}

if (mapElement) loadGoogleMaps().catch(console.error);
