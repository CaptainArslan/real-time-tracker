
const socket = io();

var count = 0;
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('sendLocation', { latitude, longitude });
        },
        (error) => {
            console.error('Error getting location:', error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
}

// Initialize the map
var map = L.map('map').setView([0, 0], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'M Arslan'
}).addTo(map);

const markers = {};

socket.on('connect', () => {
    console.log("connected");
});
socket.on('receiveLocation', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 15);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(id);
    }
    console.log(markers);
});

socket.on('userDisconnected', (id) => {
    console.log("disconnected", id);
    if (markers[id]) {
        console.log("removing", id);
        map.removeLayer(markers[id]);
        delete markers[id];
        console.log(markers);
    }
});