import React, { useEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TripMultiView from "@/Components/Maps/TripMultiView";
import { parseDateTimeFull } from "@/utils/helper-function";
import { BreadcrumbsTrips } from "@/Pages/Trips/Constant";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Chart from "react-apexcharts";
import { FONT_FAMILY } from "@/utils/constants";

export default function TripsViewMulti({ tripIds }) {
    const breadcrumbs = [<BreadcrumbsTrips />, "Lihat"];
    const [trips, setTrips] = useState([]);
    const [avgSeries, setAvgSeries] = useState([]);
    const [p85Series, setP85Series] = useState([]);
    const [avgCategories, setAvgCategories] = useState([]);
    const [p85Categories, setP85Categories] = useState([]);
    const [intervalSeconds, setIntervalSeconds] = useState(5);
    const [selectedChart, setSelectedChart] = useState("p85");
    const [distanceInterval, setDistanceInterval] = useState(100);

    const chartOptions = [
        {
            value: "p85",
            label: "Persentil 85",
        },
        {
            value: "avg",
            label: "Rata Rata",
        },
        {
            value: "speed",
            label: "Kecepatan per Waktu",
        },
        {
            value: "acceleration",
            label: "Percepatan",
        },
        {
            value: "speed-distance",
            label: "Kecepatan per Jarak",
        },
    ];

    const chartControls = {
        speed: {
            value: intervalSeconds,
            onChange: (e) => setIntervalSeconds(Number(e.target.value)),
            options: [
                { value: 1, label: "1 Detik" },
                { value: 5, label: "5 Detik" },
                { value: 10, label: "10 Detik" },
                { value: 30, label: "30 Detik" },
                { value: 60, label: "1 Menit" },
                { value: 300, label: "5 Menit" },
            ],
        },

        acceleration: {
            value: intervalSeconds,
            onChange: (e) => setIntervalSeconds(Number(e.target.value)),
            options: [
                { value: 1, label: "1 Detik" },
                { value: 5, label: "5 Detik" },
                { value: 10, label: "10 Detik" },
                { value: 30, label: "30 Detik" },
                { value: 60, label: "1 Menit" },
                { value: 300, label: "5 Menit" },
            ],
        },

        "speed-distance": {
            value: distanceInterval,
            onChange: (e) => setDistanceInterval(Number(e.target.value)),
            options: [
                { value: 10, label: "10 Meter" },
                { value: 50, label: "50 Meter" },
                { value: 100, label: "100 Meter" },
                { value: 500, label: "500 Meter" },
                { value: 1000, label: "1 KM" },
            ],
        },
    };

    const fetchTripStats = async () => {
        try {
            const res = await axios.get(`/api/trip/statistics/multi`, {
                params: {
                    trip_ids: tripIds,
                },
            });

            const data = res.data;

            setAvgSeries(data.avg || []);
            setP85Series(data.p85 || []);

            const maxAvgLength = Math.max(
                ...(data.avg || []).map((item) => item.data.length),
                0,
            );

            const maxP85Length = Math.max(
                ...(data.p85 || []).map((item) => item.data.length),
                0,
            );

            setAvgCategories(Array.from({ length: maxAvgLength }, (_, i) => i));

            setP85Categories(Array.from({ length: maxP85Length }, (_, i) => i));
        } catch (error) {
            console.error(error);
        }
    };

    const roundUpTo10 = (value) => Math.ceil(value / 10) * 10;

    const getMaxValue = (series) => {
        if (!series || series.length === 0) return 0;

        const allValues = series.flatMap((item) => item.data || []);
        return Math.max(...allValues);
    };

    useEffect(() => {
        let stop = false;

        const fetchAllPages = async (tripId) => {
            let page = 1;
            let allData = [];
            let hasNext = true;

            while (hasNext) {
                const res = await axios.get(`/api/trip/${tripId}?page=${page}`);

                const payload = res.data;

                allData = [...allData, ...(payload.data || [])];

                if (payload.next_page_url) {
                    page++;
                } else {
                    hasNext = false;
                }
            }

            return allData;
        };

        const loadTrips = async () => {
            try {
                const result = await Promise.all(
                    tripIds.map(async (tripId) => {
                        const data = await fetchAllPages(tripId);

                        return {
                            trip_id: tripId,
                            data,
                        };
                    }),
                );

                if (!stop) {
                    setTrips(result);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadTrips();

        return () => (stop = true);
    }, [tripIds]);

    useEffect(() => {
        fetchTripStats();
    }, [tripIds]);

    const avgMax = useMemo(() => {
        const max = getMaxValue(avgSeries);
        return roundUpTo10(max);
    }, [avgSeries]);

    const p85Max = useMemo(() => {
        const max = getMaxValue(p85Series);
        return roundUpTo10(max);
    }, [p85Series]);

    const tripSummaries = useMemo(() => {
        return avgSeries.map((avgItem) => {
            const trip = trips.find((t) => t.trip_id === avgItem.trip_id);

            return {
                name: avgItem.name,
                trip_id: avgItem.trip_id,
                start: trip?.data?.length > 0 ? trip.data[0].recorded_at : null,
                end:
                    trip?.data?.length > 0
                        ? trip.data[trip.data.length - 1].recorded_at
                        : null,
            };
        });
    }, [trips, avgSeries]);

    const speedChartData = useMemo(() => {
        if (trips.length === 0 || avgSeries.length === 0) return [];

        return avgSeries.map((avgItem) => {
            const trip = trips.find((t) => t.trip_id === avgItem.trip_id);

            if (!trip) {
                return {
                    name: avgItem.name,
                    data: [],
                };
            }

            let lastTimestamp = 0;

            return {
                name: avgItem.name,
                data: trip.data
                    .filter((item) => {
                        const current = new Date(item.recorded_at).getTime();

                        if (
                            lastTimestamp === 0 ||
                            current - lastTimestamp >= intervalSeconds * 1000
                        ) {
                            lastTimestamp = current;
                            return true;
                        }

                        return false;
                    })
                    .map((item) => item.speed),
            };
        });
    }, [trips, avgSeries, intervalSeconds]);

    const speedCategories = useMemo(() => {
        const maxLength = Math.max(
            ...speedChartData.map((item) => item.data.length),
            0,
        );

        return Array.from({ length: maxLength }, (_, i) => {
            const totalSeconds = (i + 1) * intervalSeconds;

            const hours = String(Math.floor(totalSeconds / 3600)).padStart(
                2,
                "0",
            );

            const minutes = String(
                Math.floor((totalSeconds % 3600) / 60),
            ).padStart(2, "0");

            const seconds = String(totalSeconds % 60).padStart(2, "0");

            return `${hours}:${minutes}:${seconds}`;
        });
    }, [speedChartData, intervalSeconds]);

    const accelerationChartData = useMemo(() => {
        if (trips.length === 0 || avgSeries.length === 0) return [];

        return avgSeries.map((avgItem) => {
            const trip = trips.find((t) => t.trip_id === avgItem.trip_id);

            if (!trip) {
                return {
                    name: avgItem.name,
                    data: [],
                };
            }

            let lastTimestamp = 0;

            const filtered = trip.data.filter((item) => {
                const current = new Date(item.recorded_at).getTime();

                if (
                    lastTimestamp === 0 ||
                    current - lastTimestamp >= intervalSeconds * 1000
                ) {
                    lastTimestamp = current;
                    return true;
                }

                return false;
            });

            const accelerationData = [];

            for (let i = 1; i < filtered.length; i++) {
                const prevSpeed = Number(filtered[i - 1].speed || 0);
                const currentSpeed = Number(filtered[i].speed || 0);

                const acceleration =
                    (currentSpeed - prevSpeed) / intervalSeconds;

                accelerationData.push(Number(acceleration.toFixed(2)));
            }

            return {
                name: avgItem.name,
                data: accelerationData,
            };
        });
    }, [trips, avgSeries, intervalSeconds]);

    const speedDistanceChartData = useMemo(() => {
        if (trips.length === 0 || avgSeries.length === 0) return [];

        return avgSeries.map((avgItem) => {
            const trip = trips.find((t) => t.trip_id === avgItem.trip_id);

            if (!trip || trip.data.length === 0) {
                return {
                    name: avgItem.name,
                    data: [],
                };
            }

            const grouped = [];
            let currentBucket = 0;
            let speeds = [];

            trip.data.forEach((item) => {
                const distanceMeters =
                    Number(item.total_distance_km || 0) * 1000;

                if (distanceMeters >= currentBucket + distanceInterval) {
                    if (speeds.length > 0) {
                        const avgSpeed =
                            speeds.reduce((a, b) => a + b, 0) / speeds.length;

                        grouped.push(Number(avgSpeed.toFixed(2)));
                    }

                    currentBucket += distanceInterval;
                    speeds = [];
                }

                speeds.push(Number(item.speed || 0));
            });

            // bucket terakhir
            if (speeds.length > 0) {
                const avgSpeed =
                    speeds.reduce((a, b) => a + b, 0) / speeds.length;

                grouped.push(Number(avgSpeed.toFixed(2)));
            }

            return {
                name: avgItem.name,
                data: grouped,
            };
        });
    }, [trips, avgSeries, distanceInterval]);

    const distanceCategories = useMemo(() => {
        const maxLength = Math.max(
            ...speedDistanceChartData.map((item) => item.data.length),
            0,
        );

        return Array.from({ length: maxLength }, (_, i) => {
            const distance = i * distanceInterval;

            if (distance >= 1000) {
                return `${distance / 1000} km`;
            }

            return `${distance} m`;
        });
    }, [speedDistanceChartData, distanceInterval]);

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
            max: avgMax,
            tickAmount: avgMax / 10,
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
            max: p85Max,
            tickAmount: p85Max / 10,
            labels: {
                formatter: (val) => Math.round(val),
            },
            title: { text: "Kecepatan (Km/jam)" },
        },
        title: { text: "Persentil 85" },
    };

    const speedOptions = {
        chart: {
            id: "speed-over-time",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: {
            categories: speedCategories,
            title: {
                text: "Durasi Perjalanan",
            },
            labels: {
                rotate: -45,
            },
            tickAmount: 10,
        },
        yaxis: {
            min: 0,
            title: {
                text: `Kecepatan (Km/jam per ${intervalSeconds} detik)`,
            },
            labels: {
                formatter: (val) => Number(val).toFixed(0),
            },
        },
        stroke: {
            curve: "smooth",
        },
        title: {
            text: `Kecepatan Berdasarkan Durasi (${intervalSeconds} detik)`,
        },
    };

    const accelerationOptions = {
        chart: {
            id: "acceleration-chart",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: {
            categories: speedCategories,
            title: {
                text: "Durasi Perjalanan",
            },
            labels: {
                rotate: -45,
            },
            tickAmount: 10,
        },
        yaxis: {
            title: {
                text: `Percepatan (Km/jam per ${intervalSeconds} detik)`,
            },
            labels: {
                formatter: (val) => Number(val).toFixed(2),
            },
        },
        stroke: {
            curve: "smooth",
        },
        title: {
            text: `Percepatan Berdasarkan Durasi (${intervalSeconds} detik)`,
        },
    };

    const speedDistanceOptions = {
        chart: {
            id: "speed-distance-chart",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: {
            categories: distanceCategories,
            title: {
                text: "Jarak Tempuh",
            },
            labels: {
                rotate: -45,
            },
            tickAmount: 10,
        },
        yaxis: {
            min: 0,
            title: {
                text: "Kecepatan (Km/jam)",
            },
            labels: {
                formatter: (val) => Number(val).toFixed(0),
            },
        },
        stroke: {
            curve: "smooth",
        },
        title: {
            text: "Kecepatan Berdasarkan Jarak",
        },
    };

    const currentChart = useMemo(() => {
        switch (selectedChart) {
            case "avg":
                return {
                    options: avgOptions,
                    series: avgSeries,
                };

            case "speed":
                return {
                    options: speedOptions,
                    series: speedChartData,
                };

            case "acceleration":
                return {
                    options: accelerationOptions,
                    series: accelerationChartData,
                };
            case "speed-distance":
                return {
                    options: speedDistanceOptions,
                    series: speedDistanceChartData,
                };

            case "p85":
            default:
                return {
                    options: p85Options,
                    series: p85Series,
                };
        }
    }, [
        selectedChart,
        avgOptions,
        avgSeries,
        p85Options,
        p85Series,
        speedOptions,
        speedChartData,
        accelerationOptions,
        accelerationChartData,
        speedDistanceOptions,
        speedDistanceChartData,
    ]);

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Trip" />
            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <div className="mb-3">
                            <h2 className="font-bold text-base">
                                {tripIds.length > 1
                                    ? "Perbandingan Beberapa Trip"
                                    : "Detail Trip"}
                                :{" "}
                            </h2>
                            <div className="mt-2 text-sm">
                                {tripSummaries.map((trip) => (
                                    <div key={trip.trip_id}>
                                        <b>{trip.name}</b> :{" "}
                                        {parseDateTimeFull(trip.start)}
                                        {" - "}
                                        {parseDateTimeFull(trip.end)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <TripMultiView trips={trips} />
                        <div className="mt-5 overflow-y-hidden">
                            <div className="w-5/6 mx-auto mb-4 flex gap-3">
                                <select
                                    className="select select-bordered"
                                    value={selectedChart}
                                    onChange={(e) =>
                                        setSelectedChart(e.target.value)
                                    }
                                >
                                    {chartOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {chartControls[selectedChart] && (
                                    <select
                                        className="select select-bordered"
                                        value={
                                            chartControls[selectedChart].value
                                        }
                                        onChange={
                                            chartControls[selectedChart]
                                                .onChange
                                        }
                                    >
                                        {chartControls[
                                            selectedChart
                                        ].options.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="w-5/6 mx-auto">
                                <Chart
                                    options={currentChart.options}
                                    series={currentChart.series}
                                    type="line"
                                    height={400}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
