import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import mqtt from "mqtt";
import TableDropdown from "@/Components/TableDropdown";
import MapView from "@/Components/Maps/MapView";
import {
    MQTT_BROKE_URL,
    MQTT_USERNAME,
    MQTT_PASSWORD,
    MQTT_TOPIC,
    MQTT_CLIENT_ID,
} from "@/utils/constants";
import SpeedometerCircle from "@/Components/Speedometer";
import { FaSatelliteDish } from "react-icons/fa";

export default function Map({ devices }) {
    const [selectedDevices, setSelectedDevices] = useState(
        devices.map((d) => d.identifier),
    );
    const [devicePositions, setDevicePositions] = useState({});

    useEffect(() => {
        const client = mqtt.connect(MQTT_BROKE_URL, {
            clientId: MQTT_CLIENT_ID(),
            username: MQTT_USERNAME,
            password: MQTT_PASSWORD,
        });

        client.on("connect", () => {
            console.log("Connected to EMQX");
            client.subscribe(MQTT_TOPIC, { qos: 0 }, (err) => {
                if (err) console.log("Subscribe error:", err);
            });
        });

        client.on("message", (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                const { device_id, latitude, longitude, speed } = payload;

                setDevicePositions((prev) => ({
                    ...prev,
                    [device_id]: {
                        id: device_id,
                        latitude,
                        longitude,
                        speed,
                    },
                }));
            } catch (e) {
                console.error("Invalid JSON payload", e);
            }
        });

        return () => client.end();
    }, []);

    function toggleDevice(id) {
        setSelectedDevices((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    }

    // Ambil hanya posisi device yg dipilih
    const visiblePositions = Object.values(devicePositions)
        .filter((d) => selectedDevices.includes(d.id))
        .map((pos) => ({
            ...pos,
            name: devices.find((x) => x.identifier === pos.id)?.name ?? pos.id,
        }));

    return (
        <AuthenticatedLayout>
            <Head title="Peta Perangkat" />
            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <div className="flex items-center justify-end mb-4">
                        <TableDropdown
                            icon={<FaSatelliteDish />}
                            title="Pilih Perangkat"
                            list={devices}
                            selectedList={selectedDevices}
                            toggleItem={toggleDevice}
                            keyId="identifier"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <MapView devices={visiblePositions} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 place-items-center">
                            {visiblePositions.map((dev) => (
                                <div
                                    className="card w-60 shadow-sm"
                                    key={dev.id}
                                >
                                    <div className="card-body items-center">
                                        <div className="font-bold text-md">
                                            {dev.name}
                                        </div>

                                        <SpeedometerCircle
                                            max={150}
                                            speed={dev.speed ?? 0}
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
