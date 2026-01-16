import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import mqtt from "mqtt";
import TableDropdown from "@/Components/TableDropdown";
import MapView from "@/Components/Maps/MapView";

export default function Map({ devices }) {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [devicePositions, setDevicePositions] = useState({});

    const clientId = "emqx_test_" + Math.random().toString(16).substring(2, 8);
    const username = "simprok-web";
    const password = "simprok-web";

    useEffect(() => {
        const client = mqtt.connect(
            "wss://rf60f168.ala.asia-southeast1.emqxsl.com:8084/mqtt",
            { clientId, username, password }
        );

        client.on("connect", () => {
            console.log("Connected to EMQX");
            const topic = "testtopic/1";
            client.subscribe(topic, { qos: 0 }, (err) => {
                if (err) console.log(`Subscribe ${topic} error:`, err);
            });
        });

        client.on("message", (topic, message) => {
            try {
                console.log(message);
                const payload = JSON.parse(message.toString());
                const { device_id, latitude, longitude } = payload;

                setDevicePositions((prev) => ({
                    ...prev,
                    [device_id]: { id: device_id, latitude, longitude },
                }));
            } catch (e) {
                console.error("Invalid JSON payload", e);
            }
        });

        return () => client.end();
    }, []);

    function toggleDevice(deviceIdentifier) {
        const updatedDevices = selectedDevices.includes(deviceIdentifier)
            ? selectedDevices.filter((r) => r !== deviceIdentifier)
            : [...selectedDevices, deviceIdentifier];

        setSelectedDevices(updatedDevices);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Kecepatan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex items-center justify-end mb-4">
                        <TableDropdown
                            title="Pilih Perangkat"
                            // icon={<FaUserShield />}
                            list={devices}
                            selectedList={selectedDevices}
                            toggleItem={toggleDevice}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <MapView devices={Object.values(devicePositions)} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
