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
import SpeedometerCircle from "@/Components/Speedometer";

export default function Speed({ devices }) {
    const [selectedDevices, setSelectedDevices] = useState(
        devices.map((d) => d.identifier),
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
            client.subscribe(MQTT_TOPIC, { qos: 0 }, (err) => {
                if (err) console.log(`Subscribe ${MQTT_TOPIC} error:`, err);
            });
        });

        client.on("message", (topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                const deviceId = payload.device_id;
                const speed = payload.speed ?? 0;
                const tsDate = new Date(payload.recorded_at);
                const tsMs = tsDate.getTime();

                setDeviceData((prev) => {
                    const prevData = prev[deviceId] || {
                        speedSeries: [],
                        timeLabelsMs: [],
                        lastTimestamp: 0,
                    };

                    let speedSeries = [...prevData.speedSeries];
                    let timeLabelsMs = [...prevData.timeLabelsMs];
                    let lastTimestamp = prevData.lastTimestamp;

                    // --- Fill missing seconds ---
                    if (lastTimestamp > 0) {
                        const diff = Math.round((tsMs - lastTimestamp) / 1000);
                        if (diff > 1 && diff < 100) {
                            for (let i = 1; i < diff; i++) {
                                timeLabelsMs.push(lastTimestamp + i * 1000);
                                speedSeries.push(0);
                            }
                        }
                    }

                    // --- Push current data ---
                    timeLabelsMs.push(tsMs);
                    speedSeries.push(speed);
                    lastTimestamp = tsMs;

                    // Keep only last 20 seconds
                    if (timeLabelsMs.length > 20) {
                        timeLabelsMs = timeLabelsMs.slice(-20);
                        speedSeries = speedSeries.slice(-20);
                    }

                    return {
                        ...prev,
                        [deviceId]: {
                            speedSeries,
                            timeLabelsMs,
                            lastTimestamp,
                        },
                    };
                });
            } catch (e) {
                console.error("Invalid JSON payload", e);
            }
        });

        return () => client.end();
    }, []);

    // --- Global timeline & series ---
    const allTimestamps = Object.values(deviceData)
        .flatMap((d) => d.timeLabelsMs)
        .sort((a, b) => a - b);

    const uniqueTimestamps = [...new Set(allTimestamps)];

    const series = selectedDevices.map((deviceId) => {
        const data = deviceData[deviceId];
        const map = {};
        if (data) {
            data.timeLabelsMs.forEach((ts, i) => {
                map[ts] = data.speedSeries[i];
            });
        }

        const mappedData = uniqueTimestamps.map((ts) => map[ts] ?? 0);
        return {
            name:
                devices.find((d) => d.identifier === deviceId)?.name ??
                deviceId,
            data: mappedData,
        };
    });

    const categories = uniqueTimestamps.map(
        (ts) => new Date(ts).toISOString().split("T")[1].split(".")[0],
    );

    const options = {
        chart: { id: "speed-realtime", animations: { enabled: true } },
        xaxis: { categories },
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
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
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
                            height={400}
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
                                                deviceData[
                                                    device.identifier
                                                ]?.speedSeries.at(-1) ?? 0
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
