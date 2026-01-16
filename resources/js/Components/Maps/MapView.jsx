import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapView = ({
    devices = [], // [{id, latitude, longitude}]
    defaultLat = -7.289846761027304,
    defaultLng = 112.7151170415472,
    zoom = 13,
}) => {
    const mapRef = useRef(null);
    const markersRef = useRef({}); // simpan marker tiap device

    // Init map hanya sekali
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([defaultLat, defaultLng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        mapRef.current = map;
    }, []);

    // Update marker dan auto fit map
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const bounds = L.latLngBounds([]);

        devices.forEach((d) => {
            if (!d.latitude || !d.longitude) return;

            const lat = parseFloat(d.latitude);
            const lng = parseFloat(d.longitude);
            if (isNaN(lat) || isNaN(lng)) return;

            // Update posisi marker jika sudah ada
            if (markersRef.current[d.id]) {
                markersRef.current[d.id].setLatLng([lat, lng]);
            } else {
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(`ID: ${d.id}`);
                markersRef.current[d.id] = marker;
            }

            bounds.extend([lat, lng]);
        });

        // Hanya zoom pindah kalau ada minimal satu device
        if (devices.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [devices]);

    return (
        <div
            id="map"
            style={{ height: "400px", width: "100%", marginBottom: "1rem" }}
        ></div>
    );
};

export default MapView;
