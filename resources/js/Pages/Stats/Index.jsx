import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Chart from "react-apexcharts";
import { FONT_FAMILY } from "@/utils/constants";

export default function StatsIndex() {
    const [avgSeries, setAvgSeries] = useState([]);
    const [p85Series, setP85Series] = useState([]);
    const [avgCategories, setAvgCategories] = useState([]);
    const [p85Categories, setP85Categories] = useState([]);

    // Fungsi untuk fetch data dari endpoint
    const fetchTripStats = async () => {
        try {
            const response = await fetch("/api/trip/statistics");
            const data = await response.json();

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

    // Fetch data pertama kali + interval 5 detik
    useEffect(() => {
        fetchTripStats();
        const interval = setInterval(fetchTripStats, 5000); // 5000 ms = 5 detik
        return () => clearInterval(interval); // bersihkan interval saat component unmount
    }, []);

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
