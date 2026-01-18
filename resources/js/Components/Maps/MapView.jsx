import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    makeIcon,
    MI,
    MI_2X,
    MI_BLACK,
    MI_BLACK_2X,
    MI_BLUE,
    MI_BLUE_2X,
    MI_GOLD,
    MI_GOLD_2X,
    MI_GREEN,
    MI_GREEN_2X,
    MI_GREY,
    MI_GREY_2X,
    MI_ORANGE,
    MI_ORANGE_2X,
    MI_RED,
    MI_RED_2X,
    MI_VIOLET,
    MI_VIOLET_2X,
    MI_YELLOW,
    MI_YELLOW_2X,
    MS,
} from "./Constant";

const icons = [
    makeIcon(MI_BLUE, MI_BLUE_2X),
    makeIcon(MI_RED, MI_RED_2X),
    makeIcon(MI_YELLOW, MI_YELLOW_2X),
    makeIcon(MI_GREEN, MI_GREEN_2X),
    makeIcon(MI_BLACK, MI_BLACK_2X),
    makeIcon(MI_GREY, MI_GREY_2X),
    makeIcon(MI_GOLD, MI_GOLD_2X),
    makeIcon(MI_VIOLET, MI_VIOLET_2X),
    makeIcon(MI_ORANGE, MI_ORANGE_2X),
];

// default marker shadow
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: MI_2X,
    iconUrl: MI,
    shadowUrl: MS,
});

// 🔹 Legend maker (safe — no hooks)
function createLegend(map, icons, devices) {
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "legend");
        div.innerHTML = devices
            .map((d, i) => {
                const icon = icons[i % icons.length];
                return `
                <p style="margin:0; font-size:12px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
                    <img src="${icon.options.iconUrl}" style="height:20px;"/>
                    ${d.name}
                </p>`;
            })
            .join("");

        return div;
    };

    legend.addTo(map);
    return legend;
}

const MapView = ({
    devices = [],
    defaultLat = -7.2898,
    defaultLng = 112.7151,
    zoom = 13,
}) => {
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const legendRef = useRef(null);

    // init map
    useEffect(() => {
        if (mapRef.current) return;

        const map = L.map("map").setView([defaultLat, defaultLng], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
            map
        );

        mapRef.current = map;
    }, []);

    // markers + legend update
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const bounds = L.latLngBounds([]);

        devices.forEach((d, index) => {
            const lat = parseFloat(d.latitude);
            const lng = parseFloat(d.longitude);
            if (isNaN(lat) || isNaN(lng)) return;

            const icon = icons[index % icons.length];

            // update marker
            if (markersRef.current[d.id]) {
                markersRef.current[d.id]
                    .setLatLng([lat, lng])
                    .setPopupContent(
                        `<b>${d.name}</b><br/>Kecepatan: ${d.speed ?? 0} km/h`
                    )
                    .setIcon(icon);
            } else {
                const marker = L.marker([lat, lng], { icon }).addTo(map);
                marker.bindPopup(
                    `<b>${d.name}</b><br/>Kecepatan: ${d.speed ?? 0} km/h`
                );
                markersRef.current[d.id] = marker;
            }

            bounds.extend([lat, lng]);
        });

        // remove stale markers
        Object.keys(markersRef.current).forEach((id) => {
            if (!devices.find((d) => d.id === id)) {
                map.removeLayer(markersRef.current[id]);
                delete markersRef.current[id];
            }
        });

        // fit bounds
        if (devices.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        // refresh legend
        if (legendRef.current) {
            map.removeControl(legendRef.current);
        }
        legendRef.current = createLegend(map, icons, devices);
    }, [devices]);

    return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default MapView;
