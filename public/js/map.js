async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.googleApiKey;
}

// Initialize the map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const defaultPosition = { lat: 51.501364, lng: -0.1444649 };
    // Set up the map centered on the provided lat/lng
    map = new Map(document.getElementById("map"), {
        center: defaultPosition,
        zoom: 10,
        mapId: "DEMO_MAP_ID",
    });

    // Place a marker on the map
    new AdvancedMarkerElement({
        map: map,
        position: defaultPosition,
        title: 'Your Location',
    });
}

async function createMap(googleApiKey) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // call initMap by google
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
}

// async function createMap() {
//     const googleApiKey = await fetchGoogleApiKey();

//     (g => {
//         var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
//         b = b[c] || (b[c] = {});
//         var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
//             u = () => h || (h = new Promise(async (f, n) => {
//                 await (a = m.createElement("script"));
//                 e.set("libraries", [...r] + "");
//                 for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
//                 e.set("callback", c + ".maps." + q);
//                 a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
//                 d[q] = f;
//                 a.onerror = () => h = n(Error(p + " could not load."));
//                 a.nonce = m.querySelector("script[nonce]")?.nonce || "";
//                 m.head.append(a);
//             }));
//         d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
//     })({
        
//         key: googleApiKey,
//         v: "weekly",
//     });

//     let map;
// }

// Function to orchestrate the loading of the map
async function init() {
    try {
      const googleApiKey = await fetchGoogleApiKey();
      await createMap(googleApiKey);
      // initMap will be called automatically by the Google Maps API callback
    } catch (error) {
      console.error('Error loading the map:', error);
    }
  }
  
  // Call the init function to start the process
init();

// First create google map before add markers.
// createMap().then(()=>{
//     initMap();
// })



