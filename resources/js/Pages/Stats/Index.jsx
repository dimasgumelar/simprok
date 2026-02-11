import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Chart from "react-apexcharts";
import { FONT_FAMILY } from "@/utils/constants";
import { InputDropdownManualList } from "@/Components/FormInput";

export default function StatsIndex() {
    const [filter, setFilter] = useState([]);
    const [avgSeries, setAvgSeries] = useState([]);
    const [p85Series, setP85Series] = useState([]);
    const [avgCategories, setAvgCategories] = useState([]);
    const [p85Categories, setP85Categories] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState({});
    const [isOptimal, setIsOptimal] = useState(false);

    const fetchFilter = async () => {
        try {
            const response = await fetch("/api/trip/statistics");

            if (!response.ok) throw new Error("Failed fetch filter");

            const data = await response.json();
            setFilter(data.filter);
        } catch (err) {
            console.error(err);
        }
    };

    // Fungsi untuk fetch data dari endpoint
    const fetchTripStats = async () => {
        try {
            if (!isOptimal && Object.keys(selectedTrips).length === 0) return;
            const params = new URLSearchParams();

            Object.entries(selectedTrips).forEach(([deviceId, tripId]) => {
                params.append("device_id[]", deviceId);
                params.append("trip_id[]", tripId);
            });

            params.append("is_optimal", isOptimal ? 1 : 0);

            const response = await fetch(
                "/api/trip/statistics?" + params.toString(),
            );

            if (!response.ok) {
                if (response.status === 422) {
                    const err = await response.json();
                    console.warn("Validation error:", err);
                    return;
                }

                throw new Error(
                    "Request failed with status " + response.status,
                );
            }

            const data = await response.json();

            setFilter(data.filter);

            const maxAvgLength = Math.max(
                ...data.avg.map((item) => item.data.length),
            );
            const maxP85Length = Math.max(
                ...data.p85.map((item) => item.data.length),
            );

            setAvgSeries(data.avg);
            setP85Series(data.p85);
            setAvgCategories(Array.from({ length: maxAvgLength }, (_, i) => i));
            setP85Categories(Array.from({ length: maxP85Length }, (_, i) => i));
        } catch (error) {
            console.error("Error fetching trip stats:", error);
        }
    };

    useEffect(() => {
        fetchFilter();
    }, []);

    useEffect(() => {
        if (!isOptimal && Object.keys(selectedTrips).length === 0) return;

        fetchTripStats();

        const interval = setInterval(fetchTripStats, 5000);
        return () => clearInterval(interval);
    }, [selectedTrips, isOptimal]);

    const handleTripChange = (deviceKey, value) => {
        setSelectedTrips((prev) => ({
            ...prev,
            [deviceKey]: value,
        }));

        setIsOptimal(false);
    };

    const toggleOptimal = () => {
        setIsOptimal((prev) => !prev);
        setSelectedTrips({});
    };

    const avgOptions = {
        chart: {
            id: "avg-speed-realtime",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: {
            categories: avgCategories,
            title: {
                text: "Jarak (Km)",
            },
        },
        stroke: { curve: "stepline" },
        yaxis: {
            min: 0,
            max: 150,
            tickAmount: 6,
            labels: {
                formatter: (val) => Math.round(val),
            },
            title: { text: "Kecepatan (Km/jam)" },
        },
        title: { text: "Rata Rata" },
    };

    const p85Options = {
        chart: {
            id: "p85-speed-realtime",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: {
            categories: p85Categories,
            title: {
                text: "Jarak (Km)",
            },
        },
        stroke: { curve: "stepline" },
        yaxis: {
            min: 0,
            max: 150,
            tickAmount: 6,
            labels: {
                formatter: (val) => Math.round(val),
            },
            title: { text: "Kecepatan (Km/jam)" },
        },
        title: { text: "Persentil 85" },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Trip Stats" />
            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <h2 className="font-bold text-lg text-center">
                        Profil Kecepatan Kendaraan
                    </h2>
                    <div className="flex flex-wrap justify-center items-end gap-2">
                        {filter.map((item, index) => (
                            <div className="w-1/6" key={index}>
                                <InputDropdownManualList
                                    disabled={isOptimal}
                                    label={`Trip ${item.name}`}
                                    value={selectedTrips[item.device_id] || ""}
                                    onChange={(val) =>
                                        handleTripChange(
                                            item.device_id,
                                            val.target.value,
                                        )
                                    }
                                    list={item.trip_ids}
                                />
                            </div>
                        ))}
                        <label className="label h-[40px]">
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={isOptimal}
                                onChange={toggleOptimal}
                            />
                            Optimal
                        </label>
                    </div>
                    {/* Chart P85 */}
                    <div className="w-5/6 mx-auto">
                        <Chart
                            options={p85Options}
                            series={p85Series}
                            type="line"
                            height={400}
                        />
                    </div>

                    {/* Chart Avg */}
                    <div className="w-5/6 mx-auto">
                        <Chart
                            options={avgOptions}
                            series={avgSeries}
                            type="line"
                            height={400}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
