import React, { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TripMap from "@/Components/Maps/TripMap";

export default function TripView({ identifier, tripId }) {
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let stop = false;

        const loadPage = async () => {
            try {
                const res = await axios.get(
                    `/api/trip/${identifier}/${tripId}?page=${page}`
                );
                const batch = res.data.data;

                if (!stop && batch.length > 0) {
                    setTrips((prev) => [...prev, ...batch]);
                }

                if (res.data.next_page_url) {
                    setPage((prev) => prev + 1);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        loadPage();
        return () => (stop = true);
    }, [page, tripId]);

    return (
        <AuthenticatedLayout>
            <Head title="Kecepatan" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <TripMap trips={trips} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
