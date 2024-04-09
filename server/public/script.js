const getMeasurements = () => {
    fetch('/api/measurements').then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    });
};

const updateMeasurements = () => {
    const id = 'uAsnMO8QJRQtTbNXdYHH';
    const obj = {
        Temperature: 6,
        Humidity: 7,
        Timestamp: new Date()
    };
    fetch(`/api/measurements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    });
};

const addMeasurement = () => {
    const obj = {
        temperature: 6,
        humidity: 7,
        timestamp: new Date()
    };
    fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    }).then(response => {
        return response.json();
    }).then(data => {
        getMeasurements();
        console.log(data);
    });
};

const deleteMeasurements = () => {
    const id = 'uAsnMO8QJRQtTbNXdYHH';
    fetch(`/api/measurements/${id}`, {
        method: 'DELETE'
    }).then(response => {
        return response.json();
    }).then(data => {
        getMeasurements();
        console.log(data);
    });
};

addMeasurement();