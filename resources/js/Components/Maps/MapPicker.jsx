import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MI, MI_2X, MS } from "./Constant";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: MI_2X,
    iconUrl: MI,
    shadowUrl: MS,
});

const MapPicker = ({
    onLocationChange,
    latitude = -7.289846761027304,
    longitude = 112.7151170415472,
    zoom = 13,
    disabled = false,
}) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([latitude, longitude], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map
        );

        map.on("click", (e) => {
            if (disabled) {
                e.stopPropagation();
            } else {
                const { lat, lng } = e.latlng;

                if (markerRef.current) {
                    map.removeLayer(markerRef.current);
                }

                const newMarker = L.marker([lat, lng]).addTo(map);
                markerRef.current = newMarker;

                onLocationChange({ lat, lng });
            }
        });

        mapRef.current = map;
    }, []);

    // Update marker dan posisi jika latitude / longitude berubah
    useEffect(() => {
        if (!mapRef.current) return;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            const map = mapRef.current;

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }

            map.setView([lat, lng]);
        }
    }, [latitude, longitude]);

    return (
        <div
            id="map"
            style={{ height: "400px", width: "100%", marginBottom: "1rem" }}
        ></div>
    );
};

export default MapPicker;
