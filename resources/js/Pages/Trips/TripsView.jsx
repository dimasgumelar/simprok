import React, { useEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TripMap from "@/Components/Maps/TripView";
import { parseDateTimeFull } from "@/utils/helper-function";
import { BreadcrumbsTrips } from "@/Pages/Trips/Constant";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Chart from "react-apexcharts";
import { FONT_FAMILY } from "@/utils/constants";

export default function TripsView({ identifier, tripId }) {
    const breadcrumbs = [<BreadcrumbsTrips />, "Lihat"];
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [avgSeries, setAvgSeries] = useState([]);
    const [p85Series, setP85Series] = useState([]);
    const [avgCategories, setAvgCategories] = useState([]);
    const [p85Categories, setP85Categories] = useState([]);

    const fetchTripStats = async () => {
        try {
            const res = await axios.get(
                `/api/trip/statistics/${identifier}/${tripId}`,
            );

            const data = res.data;

            console.log(data);

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

    const roundUpTo10 = (value) => Math.ceil(value / 10) * 10;

    const getMaxValue = (series) => {
        if (!series || series.length === 0) return 0;

        const allValues = series.flatMap((item) => item.data || []);
        return Math.max(...allValues);
    };

    useEffect(() => {
        let stop = false;

        const loadPage = async () => {
            try {
                const res = await axios.get(
                    `/api/trip/${identifier}/${tripId}?page=${page}`,
                );
                const batch = res.data.data;

                if (!stop && batch.length > 0) {
                    setTrips((prev) => [...prev, ...batch]);
                }

                if (res.data.next_page_url) {
                    setPage((prev) => prev + 1);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadPage();
        return () => (stop = true);
    }, [page, tripId]);

    useEffect(() => {
        fetchTripStats();
    }, [identifier, tripId]);

    const avgMax = useMemo(() => {
        const max = getMaxValue(avgSeries);
        return roundUpTo10(max);
    }, [avgSeries]);

    const p85Max = useMemo(() => {
        const max = getMaxValue(p85Series);
        return roundUpTo10(max);
    }, [p85Series]);

    const startDate = useMemo(
        () => (trips.length > 0 ? trips[0].recorded_at : null),
        [trips],
    );

    const endDate = useMemo(
        () => (trips.length > 0 ? trips[trips.length - 1].recorded_at : null),
        [trips],
    );

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

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Trip" />
            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <h2 className="font-bold text-base mb-3">
                            Trip : {tripId} ({parseDateTimeFull(startDate)} -{" "}
                            {parseDateTimeFull(endDate)})
                        </h2>
                        <TripMap trips={trips} />
                        <div className="mt-5 overflow-y-hidden">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
