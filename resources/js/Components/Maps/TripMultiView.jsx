import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDuration, parseDateTime } from "@/utils/helper-function";

// Marker icons
import {
    makeIcon,
    MI,
    MI_2X,
    MI_GREEN,
    MI_GREEN_2X,
    MI_RED,
    MI_RED_2X,
    MS,
} from "./Constant";

// Custom start (green) & end (red)
const startIcon = makeIcon(MI_GREEN, MI_GREEN_2X);
const endIcon = makeIcon(MI_RED, MI_RED_2X);

// Default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: MI_2X,
    iconUrl: MI,
    shadowUrl: MS,
});

const TripMultiView = ({
    trips = [],
    defaultLat = -6.984172111030562,
    defaultLng = 110.41259842198662,
    zoom = 13,
}) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const polylineRef = useRef(null);

    // Init map + legend once
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([defaultLat, defaultLng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map,
        );

        // ---- LEGEND CONTROL ----
        const legend = L.control({ position: "bottomleft" });
        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "legend");
            div.innerHTML = `
                <p style="margin:0; font-size:12px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                    <img src="${MI_GREEN}" style="height:20px;" />
                    Awal Perjalanan
                </p>
                <p style="margin:0; font-size:12px; display:flex; align-items:center; gap:4px;">
                    <img src="${MI_RED}" style="height:20px;" />
                    Akhir Perjalanan
                </p>
            `;
            return div;
        };
        legend.addTo(map);

        mapRef.current = map;
    }, []);

    // Update markers + polyline
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const bounds = L.latLngBounds([]);

        // clear old markers
        markersRef.current.forEach((m) => map.removeLayer(m));
        markersRef.current = [];

        // clear old polylines
        if (Array.isArray(polylineRef.current)) {
            polylineRef.current.forEach((p) => map.removeLayer(p));
        }

        polylineRef.current = [];

        trips.forEach((tripWrapper) => {
            const tripData = tripWrapper.data || [];

            const cleanTrips = tripData.filter(
                (d) =>
                    d.latitude &&
                    d.longitude &&
                    !isNaN(parseFloat(d.latitude)) &&
                    !isNaN(parseFloat(d.longitude)),
            );

            if (cleanTrips.length === 0) return;

            const points = [];

            cleanTrips.forEach((d, i) => {
                const lat = parseFloat(d.latitude);
                const lng = parseFloat(d.longitude);

                const point = [lat, lng];

                points.push(point);
                bounds.extend(point);

                // middle point
                if (i !== 0 && i !== cleanTrips.length - 1) {
                    const circle = L.circleMarker(point, {
                        radius: 5,
                        weight: 1,
                    }).addTo(map);

                    circle.bindPopup(`
                    <b>${tripWrapper.trip_id}</b><br/>
                    Kecepatan: <b>${d.speed ?? "N/A"}</b> km/h<br/>
                    Total Jarak: <b>${Number(
                        d.total_distance_km ?? 0,
                    ).toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</b> km<br/>
                    Lama Perjalanan:
                    <b>
                        ${formatDuration(
                            cleanTrips[0]?.recorded_at,
                            d.recorded_at,
                        )}
                    </b><br/>
                    ${parseDateTime(d.recorded_at)}
                `);

                    markersRef.current.push(circle);
                }
            });

            // START
            const first = cleanTrips[0];

            const startMarker = L.marker([first.latitude, first.longitude], {
                icon: startIcon,
            }).addTo(map);

            startMarker.bindPopup(`
            <b>Titik Awal</b><br/>
            Trip: <b>${tripWrapper.trip_id}</b><br/>
            Kecepatan: <b>${first.speed ?? "N/A"}</b> km/h<br/>
            ${parseDateTime(first.recorded_at)}
        `);

            markersRef.current.push(startMarker);

            // END
            const last = cleanTrips[cleanTrips.length - 1];

            const endMarker = L.marker([last.latitude, last.longitude], {
                icon: endIcon,
            }).addTo(map);

            endMarker.bindPopup(`
            <b>Titik Akhir</b><br/>
            Trip: <b>${tripWrapper.trip_id}</b><br/>
            Kecepatan: <b>${last.speed ?? "N/A"}</b> km/h<br/>
            Total Jarak:
            <b>
                ${Number(last.total_distance_km ?? 0).toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </b> km<br/>
            Lama Perjalanan:
            <b>
                ${formatDuration(cleanTrips[0]?.recorded_at, last.recorded_at)}
            </b><br/>
            ${parseDateTime(last.recorded_at)}
        `);

            markersRef.current.push(endMarker);

            // polyline per trip
            const polyline = L.polyline(points).addTo(map);

            polylineRef.current.push(polyline);
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, {
                padding: [50, 50],
            });
        }
    }, [trips]);

    return <div id="map" style={{ height: "450px", width: "100%" }}></div>;
};

export default TripMultiView;
