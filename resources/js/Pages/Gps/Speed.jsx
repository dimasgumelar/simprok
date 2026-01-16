import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Chart from "react-apexcharts";
import mqtt from "mqtt";
import TableDropdown from "@/Components/TableDropdown";
import {
    MQTT_BROKE_URL,
    MQTT_USERNAME,
    MQTT_PASSWORD,
    MQTT_TOPIC,
    MQTT_CLIENT_ID,
    FONT_FAMILY,
} from "@/utils/constants";

export default function Speed({ devices }) {
    const [selectedDevices, setSelectedDevices] = useState(
        devices.map((d) => d.identifier)
    );
    const [deviceData, setDeviceData] = useState({});

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

        client.on("message", (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                const deviceId = payload.device_id;
                const speed = payload.speed ?? 0;
                const ts = new Date(payload.recorded_at).toLocaleTimeString();

                setDeviceData((prev) => {
                    const prevData = prev[deviceId] || {
                        speedSeries: [],
                        timeLabels: [],
                    };

                    let speedSeries = [...prevData.speedSeries];
                    let timeLabels = [...prevData.timeLabels];

                    // --- Handle gap waktu ---
                    if (timeLabels.length > 0) {
                        const lastLabel = timeLabels[timeLabels.length - 1];
                        const lastDate = new Date(
                            `${payload.recorded_at.split(" ")[0]} ${lastLabel}`
                        );
                        const nowDate = new Date(payload.recorded_at);

                        const diff = Math.round((nowDate - lastDate) / 1000);

                        // jika selisih lebih dari 1 detik isi 0 untuk yang hilang
                        if (diff > 1 && diff < 100) {
                            // batas aman
                            for (let i = 1; i < diff; i++) {
                                const missing = new Date(
                                    lastDate.getTime() + i * 1000
                                ).toLocaleTimeString();
                                timeLabels.push(missing);
                                speedSeries.push(0);
                            }
                        }
                    }

                    // --- push data realtime ---
                    timeLabels.push(ts);
                    speedSeries.push(speed);

                    return {
                        ...prev,
                        [deviceId]: {
                            speedSeries: speedSeries.slice(-20),
                            timeLabels: timeLabels.slice(-20),
                        },
                    };
                });
            } catch (e) {
                console.error("Invalid JSON payload", e);
            }
        });

        return () => client.end();
    }, []);

    const series = selectedDevices.map((deviceId) => ({
        name: devices.find((d) => d.identifier === deviceId)?.name ?? deviceId,
        data: deviceData[deviceId]?.speedSeries || [],
    }));

    const first = selectedDevices[0];

    const options = {
        chart: { id: "speed-realtime", animations: { enabled: true } },
        xaxis: { categories: deviceData[first]?.timeLabels || [] },
        stroke: { curve: "smooth" },
        yaxis: { min: 0, max: 150, title: { text: "Km/jam" } },
        title: { text: "Kecepatan Kendaraan (Km/Jam)" },
        chart: {
            id: "speed-realtime",
            fontFamily: FONT_FAMILY,
        },
    };

    function toggleDevice(id) {
        setSelectedDevices((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Kecepatan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="flex justify-end mb-4">
                        <TableDropdown
                            title="Pilih Perangkat"
                            list={devices}
                            selectedList={selectedDevices}
                            toggleItem={toggleDevice}
                            keyId="identifier"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
