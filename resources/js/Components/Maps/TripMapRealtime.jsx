import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    makeIcon,
    MI,
    MI_2X,
    MI_BLUE,
    MI_BLUE_2X,
    MI_RED,
    MI_RED_2X,
    MI_YELLOW,
    MI_YELLOW_2X,
    MI_GREEN,
    MI_GREEN_2X,
    MI_BLACK,
    MI_BLACK_2X,
    MI_GREY,
    MI_GREY_2X,
    MI_GOLD,
    MI_GOLD_2X,
    MI_VIOLET,
    MI_VIOLET_2X,
    MI_ORANGE,
    MI_ORANGE_2X,
    MS,
    MOTOR_1,
    CAR_1,
    BUS_1,
    TRUCK_1,
} from "./Constant";
import { parseDateTime } from "@/utils/helper-function";

// ICON POOL SAMA DENGAN MapView
const icons = [
    makeIcon(MI_RED, MI_RED_2X),
    makeIcon(MI_GREEN, MI_GREEN_2X),
    makeIcon(MI_BLUE, MI_BLUE_2X),
    makeIcon(MI_YELLOW, MI_YELLOW_2X),
    makeIcon(MI_BLACK, MI_BLACK_2X),
    makeIcon(MI_GREY, MI_GREY_2X),
    makeIcon(MI_GOLD, MI_GOLD_2X),
    makeIcon(MI_VIOLET, MI_VIOLET_2X),
    makeIcon(MI_ORANGE, MI_ORANGE_2X),
];

const vehicleIcons = [
    makeIcon(MOTOR_1, MOTOR_1, 40),
    makeIcon(CAR_1, CAR_1, 55, 55),
    makeIcon(BUS_1, BUS_1, 60, 60),
    makeIcon(TRUCK_1, TRUCK_1, 60, 60),
];

// Default shadow
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: MI_2X,
    iconUrl: MI,
    shadowUrl: MS,
});

// Create legend
function createLegend(map, devices, iconMap) {
    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "legend");
        div.innerHTML = devices
            .map((d) => {
                const icon = iconMap[d.identifier];
                return `
            <p style="margin:0; font-size:12px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                <img src="${icon.options.iconUrl}" style="height:20px;" />
                ${d.name}
            </p>`;
            })
            .join("");
        return div;
    };
    legend.addTo(map);
    return legend;
}

export default function TripMapRealtime({
    trips = {}, // { device_id: [ {lat,lon,speed,recorded_at} ] }
    devices = [], // dari props halaman TripMap
    defaultLat = -7.2898,
    defaultLng = 112.7151,
    zoom = 13,
    tripStatus = true,
}) {
    const mapRef = useRef(null);
    const markerLayersRef = useRef({});
    const polylineLayersRef = useRef({});
    const iconMapRef = useRef({});
    const vehicleIconsRef = useRef({});
    const legendRef = useRef(null);

    // Init map
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([defaultLat, defaultLng], zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map,
        );

        // assign icon warna ke tiap device consistent by index
        devices.forEach((d, i) => {
            iconMapRef.current[d.identifier] = icons[i % icons.length];
            vehicleIconsRef.current[d.identifier] =
                vehicleIcons[i % vehicleIcons.length];
        });

        mapRef.current = map;
    }, []);

    // Render tiap device
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const bounds = L.latLngBounds([]);

        // Remove legend
        if (legendRef.current) map.removeControl(legendRef.current);

        devices.forEach((dev, index) => {
            const history = trips[dev.identifier] ?? [];
            const clean = history.filter(
                (p) =>
                    p.latitude &&
                    p.longitude &&
                    !isNaN(p.latitude) &&
                    !isNaN(p.longitude),
            );

            // Bersihkan layer lama
            if (markerLayersRef.current[dev.identifier]) {
                markerLayersRef.current[dev.identifier].forEach((m) =>
                    map.removeLayer(m),
                );
            }
            markerLayersRef.current[dev.identifier] = [];

            if (polylineLayersRef.current[dev.identifier]) {
                map.removeLayer(polylineLayersRef.current[dev.identifier]);
            }

            if (clean.length === 0) return;

            const points = clean.map((p) => {
                const latlng = [
                    parseFloat(p.latitude),
                    parseFloat(p.longitude),
                ];
                bounds.extend(latlng);
                return latlng;
            });

            if (tripStatus) {
                // Circle middle points
                clean.forEach((p, i) => {
                    if (i === 0 || i === clean.length - 1) return;
                    const circle = L.circleMarker([p.latitude, p.longitude], {
                        radius: 5,
                        weight: 1,
                    }).addTo(map);
                    circle.bindPopup(
                        `<b>${dev.name}</b><br/>Kecepatan: ${
                            p.speed ?? "?"
                        } km/h<br>${parseDateTime(p.recorded_at)}`,
                    );
                    markerLayersRef.current[dev.identifier].push(circle);
                });
                // Start = icon device
                const first = clean[0];
                const startMarker = L.marker(
                    [first.latitude, first.longitude],
                    {
                        icon: iconMapRef.current[dev.identifier],
                    },
                ).addTo(map);
                startMarker.bindPopup(
                    `<b>${dev.name}</b><br/>Titik Awal<br/>Kecepatan: ${
                        first.speed ?? 0
                    } km/h`,
                );
                markerLayersRef.current[dev.identifier].push(startMarker);
            }

            // End = icon device
            const last = clean[clean.length - 1];
            const endMarker = L.marker([last.latitude, last.longitude], {
                icon: vehicleIconsRef.current[dev.identifier],
            }).addTo(map);
            endMarker.bindPopup(
                `<b>${dev.name}</b><br/>Titik Akhir<br/>Kecepatan: ${
                    last.speed ?? 0
                } km/h`,
            );
            markerLayersRef.current[dev.identifier].push(endMarker);

            if (tripStatus) {
                // Polyline
                const polyline = L.polyline(points, { weight: 3 }).addTo(map);
                polylineLayersRef.current[dev.identifier] = polyline;
            }
        });

        // Fit bounding
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });

        // Recreate legend
        legendRef.current = createLegend(map, devices, vehicleIconsRef.current);
    }, [trips, devices]);

    return <div id="map" style={{ height: "450px", width: "100%" }}></div>;
}
