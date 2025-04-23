const sendLocationForm = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    // Get the form data
    const formData = new FormData(event.target);
    // console.log(`Recived formData: ${formData}`);
    
    // convert and console.log each key-value pair in the FormData object
    const formDataEntries = Array.from(formData.entries());
    console.log('Received formData entries:', formDataEntries);

    // convert FormData to a plain object for easier manipulation
    const formDataObject = {};
    formDataEntries.forEach(([key, value]) => {
        formDataObject[key] = value;
    });
    console.log('FormData as object:', formDataObject);

    try {
        // send the form data to the server 
        const response = await fetch(`http://localhost:3300/suggestedPlaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                typeOfPlace: formData.get('typeOfPlace'),
                startLocation: formData.get('YourLocation'),
                latitude: formData.get('latitude'),
                longitude: formData.get('longitude'),
                radius: formData.get('radius'),
            })
        });

        // Check if the response is ok (status in the range 200-299)
        if (response.ok) {
            const data = await response.json();
            console.log('Response from server:', data);
            document.getElementById('response').innerHTML = 'Location sent successfully!';
        } else {
            console.error('Error sending location:', response.statusText);
            document.getElementById('response').innerHTML = 'Error sending location.';
        }

    }
    catch (error) {
        console.error('Error:', error);
    }
}

