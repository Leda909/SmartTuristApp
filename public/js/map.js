async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.googleApiKey;
}
