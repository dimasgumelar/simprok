import React, { useEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TripMap from "@/Components/Maps/TripView";
import { parseDateTimeFull } from "@/utils/helper-function";

export default function TripsView({ identifier, tripId }) {
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);

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

    const startDate = useMemo(
        () => (trips.length > 0 ? trips[0].recorded_at : null),
        [trips],
    );

    const endDate = useMemo(
        () => (trips.length > 0 ? trips[trips.length - 1].recorded_at : null),
        [trips],
    );

    return (
        <AuthenticatedLayout>
            <Head title="Kecepatan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <h2 className="font-bold text-base mb-3">
                            Trip : {tripId} ({parseDateTimeFull(startDate)} -{" "}
                            {parseDateTimeFull(endDate)})
                        </h2>
                        <TripMap trips={trips} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
