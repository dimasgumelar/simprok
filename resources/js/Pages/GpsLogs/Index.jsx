import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import { parseDateTime } from "@/utils/helper-function";
import { DownloadButton } from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsGpsLogs } from "@/Pages/GpsLogs/Constant";

export default function GpsLogsIndex({ gpsLogs }) {
    const breadcrumbs = [<BreadcrumbsGpsLogs />, "Daftar"];

    const [perPage, setPerPage] = useState(gpsLogs.per_page || 10);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    function applyFilters(overrides = {}) {
        inertiaGet("gpslogs.index", {
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
        window.location.href = route("gpslogs.export", {
            search: search,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Gps Log" />
            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="flex items-center justify-end">
                        <DownloadButton onClick={handleExport} />
                        <form onSubmit={handleSearchSubmit}>
                            <TableSearch
                                inputHandler={setSearch}
                                inputValue={search}
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
                                        label="Latitude"
                                        column="latitude"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Longitude"
                                        column="longitude"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Kecepatan"
                                        column="speed"
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
                                </tr>
                            </thead>
                            <tbody>
                                {gpsLogs.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada pengguna yang ditemukan."
                                        colspan={5}
                                    />
                                ) : (
                                    gpsLogs.data.map((gpsLog, index) => (
                                        <tr key={gpsLog.id}>
                                            <th>
                                                {(gpsLogs.current_page - 1) *
                                                    gpsLogs.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{gpsLog.name}</td>
                                            <td>{gpsLog.trip_id}</td>
                                            <td>{gpsLog.latitude}</td>
                                            <td>{gpsLog.longitude}</td>
                                            <td>{gpsLog.speed}</td>
                                            <td>
                                                {parseDateTime(
                                                    gpsLog.recorded_at
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            perPage={perPage}
                            handlePerPageChange={handlePerPageChange}
                            data={gpsLogs.links}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
