import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import mqtt from "mqtt";
import TableDropdown from "@/Components/TableDropdown";
import {
    MQTT_BROKE_URL,
    MQTT_USERNAME,
    MQTT_PASSWORD,
    MQTT_TOPIC,
    MQTT_CLIENT_ID,
} from "@/utils/constants";
import SpeedometerCircle from "@/Components/Speedometer";
import TripMapRealtime from "@/Components/Maps/TripMapRealtime";

export default function TripMap({ devices }) {
    const [selectedDevices, setSelectedDevices] = useState(
        devices.map((d) => d.identifier),
    );
    const [tripStatus, setTripStatus] = useState(true);
    const [devicePositions, setDevicePositions] = useState({});
    const [tripHistoryLoaded, setTripHistoryLoaded] = useState({}); // { device_id: true }
    const tripHistoryLoadedRef = useRef({});

    useEffect(() => {
        tripHistoryLoadedRef.current = tripHistoryLoaded;
    }, [tripHistoryLoaded]);

    useEffect(() => {
        const client = mqtt.connect(MQTT_BROKE_URL, {
            clientId: MQTT_CLIENT_ID(),
            username: MQTT_USERNAME,
            password: MQTT_PASSWORD,
        });

        client.on("connect", () => {
            console.log("Connected to EMQX");
            client.subscribe(MQTT_TOPIC, { qos: 0 });
        });

        client.on("message", async (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                const {
                    device_id,
                    trip_id,
                    latitude,
                    longitude,
                    speed,
                    recorded_at,
                } = payload;

                if (!trip_id) return; // ignore jika trip belum ada

                const key = `${device_id}:${trip_id}`;

                // 1️⃣ Kalau tripId baru → reset device & load history
                if (!tripHistoryLoadedRef.current[key]) {
                    // Hapus posisi lama untuk device ini (device pindah trip)
                    setDevicePositions((prev) => {
                        const updated = { ...prev };
                        delete updated[device_id];
                        return updated;
                    });

                    try {
                        let page = 1;
                        let done = false;
                        const collected = {};

                        while (!done) {
                            const res = await axios.get(
                                `/api/trip/${device_id}/${trip_id}?page=${page}`,
                            );

                            const batch = res.data.data;
                            if (batch.length === 0) break;

                            batch.forEach((p) => {
                                let tempIdentifier = devices.find(
                                    (d) => d.id === p.device_id,
                                ).identifier;
                                if (!collected[tempIdentifier])
                                    collected[tempIdentifier] = [];

                                collected[tempIdentifier].push({
                                    id: tempIdentifier,
                                    latitude: p.latitude,
                                    longitude: p.longitude,
                                    speed: p.speed,
                                    recorded_at: p.recorded_at,
                                });
                            });

                            if (!res.data.next_page_url) {
                                done = true;
                            } else {
                                page++;
                            }
                        }

                        // Tambahkan histori ke state
                        setDevicePositions((prev) => ({
                            ...prev,
                            ...collected,
                        }));

                        setTripHistoryLoaded((prev) => ({
                            ...prev,
                            [key]: true,
                        }));
                    } catch (err) {
                        console.error("Error load trip history:", err);
                    }
                }

                // 2️⃣ Realtime update (selalu jalan)
                setDevicePositions((prev) => ({
                    ...prev,
                    [device_id]: [
                        ...(prev[device_id] || []),
                        {
                            id: device_id,
                            latitude,
                            longitude,
                            speed,
                            recorded_at,
                        },
                    ],
                }));
            } catch (e) {
                console.error("Invalid MQTT payload", e);
            }
        });

        return () => client.end();
    }, []);

    function toggleTrip(e) {
        setTripStatus(!tripStatus);
    }

    function toggleDevice(id) {
        setSelectedDevices((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    }

    // Group by device
    const visibleTrips = Object.fromEntries(
        Object.entries(devicePositions).filter(([id]) =>
            selectedDevices.includes(id),
        ),
    );

    return (
        <AuthenticatedLayout>
            <Head title="Peta Perangkat" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex items-center justify-end mb-4">
                        <label className="label">
                            <input
                                type="checkbox"
                                className="toggle"
                                defaultChecked={tripStatus}
                                onChange={toggleTrip}
                            />
                            Trip
                        </label>
                        <TableDropdown
                            title="Pilih Perangkat"
                            list={devices}
                            selectedList={selectedDevices}
                            toggleItem={toggleDevice}
                            keyId="identifier"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <TripMapRealtime
                            devices={devices}
                            trips={visibleTrips}
                            tripStatus={tripStatus}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 place-items-center">
                            {devices.map((device) => (
                                <div
                                    className="card w-60 shadow-sm"
                                    key={device.identifier}
                                >
                                    <div className="card-body items-center">
                                        <div className="font-bold text-md">
                                            {device.name}
                                        </div>

                                        <SpeedometerCircle
                                            max={150}
                                            speed={
                                                visibleTrips[
                                                    device.identifier
                                                ]?.at(-1).speed ?? 0
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
