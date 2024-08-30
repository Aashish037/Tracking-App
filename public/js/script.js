const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    )
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "openstreetmap contributors"
}).addTo(map);


const markers = {};

socket.on("receive", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received data:", data); // Add this to see the data coming from the server

    map.setView([latitude, longitude], 16);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("disconnect", () => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});