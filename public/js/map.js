async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    console.log(data.googleApiKey);
    console.log(typeof data.googleApiKey);
    return data.googleApiKey;
}


async function createMap() {
    const googleApiKey = await fetchGoogleApiKey();
    console.log(`GoogleAPI2: ${googleApiKey}`);

(g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
        u = () => h || (h = new Promise(async (f, n) => {
            await (a = m.createElement("script"));
            e.set("libraries", [...r] + "");
            for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
            e.set("callback", c + ".maps." + q);
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
            d[q] = f;
            a.onerror = () => h = n(Error(p + " could not load."));
            a.nonce = m.querySelector("script[nonce]")?.nonce || "";
            m.head.append(a);
        }));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
})({
     
    key: googleApiKey,
    v: "weekly",
});

let map;
}

// First create google map before add markers.
createMap().then(()=>{
    initMap();
})


// Initialize the map
async function initMap(lat = -25.344, lng = 131.036) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Set up the map centered on the provided lat/lng
    map = new Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 10,
        mapId: "DEMO_MAP_ID",
    });

    // Place a marker on the map
    new AdvancedMarkerElement({
        map: map,
        position: { lat: lat, lng: lng },
        title: 'Your Location',
    });
}
