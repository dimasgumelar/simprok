import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import { parseDateTime } from "@/utils/helper-function";
import { DownloadButton, ViewButton } from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsTrips } from "@/Pages/Trips/Constant";

export default function TripsIndex({ trips }) {
    const breadcrumbs = [<BreadcrumbsTrips />, "Daftar"];

    const [perPage, setPerPage] = useState(trips.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    function applyFilters(overrides = {}) {
        inertiaGet("trips.index", {
            page: 1,
            per_page: perPage,
            search: search,
            sort: sortField,
            direction: sortDirection,
            ...overrides,
        });
    }

    // PerPage
    function handlePerPageChange(e) {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ per_page: value });
    }

    // Search
    function handleSearchSubmit(e) {
        e.preventDefault();
        applyFilters();
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("trips.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Trip" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <DownloadButton onClick={handleExport} />
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch
                                inputHandler={setSearch}
                                inputValue={search}
                                placeholder="Cari (Nama / Trip)"
                            />
                        </form>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <SortableHeader
                                        label="Nama"
                                        column="name"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Trip"
                                        column="trip_id"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Tanggal Direkam"
                                        column="recorded_at"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada data yang ditemukan."
                                        colspan={5}
                                    />
                                ) : (
                                    trips.data.map((trip, index) => (
                                        <tr key={trip.trip_id}>
                                            <th>
                                                {(trips.current_page - 1) *
                                                    trips.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{trip.name}</td>
                                            <td>{trip.trip_id}</td>
                                            <td>
                                                {parseDateTime(
                                                    trip.recorded_at,
                                                )}
                                            </td>
                                            <td>
                                                <ViewButton
                                                    route={route("trips.view", {
                                                        identifier:
                                                            trip.identifier,
                                                        tripId: trip.trip_id,
                                                    })}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={trips.links}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
