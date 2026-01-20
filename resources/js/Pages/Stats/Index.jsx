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
            id: "speed-realtime",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: { categories: avgCategories },
        stroke: { curve: "smooth" },
        yaxis: { min: 0, max: 150, title: { text: "Km/jam" } },
        title: { text: "Rata Rata Kecepatan Kendaraan (Km/Jam)" },
    };

    const p85Options = {
        chart: {
            id: "speed-realtime",
            animations: { enabled: true },
            fontFamily: FONT_FAMILY,
        },
        xaxis: { categories: p85Categories },
        stroke: { curve: "smooth" },
        yaxis: { min: 0, max: 150, title: { text: "Km/jam" } },
        title: { text: "Persentil 85 Kecepatan Kendaraan (Km/Jam)" },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Trip Stats" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="overflow-x-auto space-y-6">
                        {/* Chart Avg */}
                        <div>
                            <Chart
                                options={avgOptions}
                                series={avgSeries}
                                type="line"
                                height={400}
                            />
                        </div>

                        {/* Chart P85 */}
                        <div>
                            <Chart
                                options={p85Options}
                                series={p85Series}
                                type="line"
                                height={400}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
