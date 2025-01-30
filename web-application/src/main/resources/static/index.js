const map = L.map('map').setView([45.813, 15.977], 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const marker = L.marker([45.813, 15.977]).addTo(map);


const getToken = async () => {
    const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                username: "tenant@thingsboard.org",
                password: "tenant",
            })
        }
    );

    if (!response.ok) {
        return "";
    }

    const json = await response.json();
    return json.token;
}


const main = async () => {
    // var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZW5hbnRAdGhpbmdzYm9hcmQub3JnIiwidXNlcklkIjoiOGVkMDNjNTAtZGU3Yi0xMWVmLWIzMTUtZjliMzc0ZDlmYmY3Iiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJzZXNzaW9uSWQiOiJhMTU1MWMzYS1lNWIwLTQzODEtYTE1NS1kMTBiMzhhYjBmZjEiLCJleHAiOjE3MzgxOTk0MDgsImlzcyI6InRoaW5nc2JvYXJkLmlvIiwiaWF0IjoxNzM4MTkwNDA4LCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiOGU5MzVhNjAtZGU3Yi0xMWVmLWIzMTUtZjliMzc0ZDlmYmY3IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.2gi_Oyb3EwqNpJX5se9iD_YJkI1M3BrjOcFMXm8TFF8TYmdhoKyf-jRpAxCgoUWquzp2QJah1Py9ev0iJx50Hg";
    const token = await getToken();
    const entityId = "8f0e2fb0-de7b-11ef-b315-f9b374d9fbf7";
    const webSocket = new WebSocket("ws://localhost:8080/api/ws");

    webSocket.onopen = function () {
        const object = {
            authCmd: {
                cmdId: 0,
                token: token
            },
            cmds: [
                {
                    entityType: "DEVICE",
                    entityId: entityId,
                    scope: "LATEST_TELEMETRY",
                    cmdId: 10,
                    type: "TIMESERIES"
                }
            ]
        };
        const data = JSON.stringify(object);
        webSocket.send(data);
    };

    webSocket.onmessage = function (event) {
        console.log("Received message", event.data);

        const message = JSON.parse(event.data);
        const data = message.data;

        const lat = data.latitude[0][1];
        const lng = data.longitude[0][1];

        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 18);
    };

    webSocket.onclose = function (event) {
        alert("Connection is closed!");
    };
}

main();
