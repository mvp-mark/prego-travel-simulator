import { io } from "socket.io-client";
import axios from "axios";
import polyline from "polyline"; // Install with `npm install polyline`
import dotenv from "dotenv";
dotenv.config();

const SOCKET_SERVER_URL = process.env.SOCKET_IO_SERVER; // Replace with your Socket.IO server URL
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Replace with your Google Maps API key

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"],
});

interface Location {
  latitude: number;
  longitude: number;
}

interface TravelBotData {
  paymentId: string;
  driverLocation: Location;
  requestServiceLocation: Location;
  destinationLocation: Location;
  name: string;
}

// Fetch route from Google Maps Directions API
async function fetchRouteFromGoogleMaps(
  origin: Location,
  destination: Location
): Promise<Location[]> {
  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  try {
    const response = await axios.get(url, {
      params: {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    const route = response.data.routes[0];
    if (!route) {
      console.error("No routes found from Google Maps API.");
      return [];
    }

    // Decode the polyline from the route
    const encodedPolyline = route.overview_polyline.points;
    const path = decodePolyline(encodedPolyline);

    return path;
  } catch (error: any) {
    console.error("Error fetching route from Google Maps API:", error.message);
    return [];
  }
}

// Decode a polyline into an array of latitude/longitude points
function decodePolyline(encodedPath: string): Location[] {
  return polyline.decode(encodedPath).map(([lat, lng]) => ({
    latitude: lat,
    longitude: lng,
  }));
}

// Simulate car movement along the route
function simulateCarMovement(
  path: Location[],
  paymentId: string,
  updateInterval: number
) {
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= path.length) {
      console.log("Journey completed!");
      // socket.emit("websocket", {
      //   event: `update-service/${paymentId}`,
      //   data: {
      //     paymentId,
      //     status: "completed",
      //   },
      // });
      axios
        .patch(`${SOCKET_SERVER_URL}/api/payment/${paymentId}/status`, {
          status: "completed",
        })
        .then((response) => {
          console.log("Payment status updated to completed");
          clearInterval(interval);
        })
        .catch((error) => {
          console.error("Error updating payment status:", error.message);
        });
      return;
    }

    const currentLocation = path[currentStep];
    console.log("Sending update:", currentLocation);

    // Send update to the server
    socket.emit("websocket", {
      event: `travel/${paymentId}`,
      data: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
    });

    currentStep++;
  }, updateInterval);
}

// Socket.IO connection handling
socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

// Listen for the travel-bot event
socket.on("travel-bot", async (data: TravelBotData) => {
  console.log("Received travel-bot event:", data);

  const { paymentId, driverLocation, destinationLocation } = data;

  // Fetch the route from Google Maps
  const path = await fetchRouteFromGoogleMaps(
    driverLocation,
    destinationLocation
  );
  if (path.length === 0) {
    console.error("Failed to fetch a valid route, stopping simulation.");
    return;
  }

  // Simulate movement along the route
  const updateInterval = 1000; // Time in ms between updates
  simulateCarMovement(path, paymentId, updateInterval);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});
