import React, { useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SortableHeader from "@/Components/SortableHeader";
import Breadcrumbs from "@/Components/Breadcrumbs";
import Pagination from "@/Components/Pagination";
import DeleteModal from "@/Components/DeleteModal";
import TableNotFound from "@/Components/TableNotFound";
import TableSearch from "@/Components/TableSearch";
import {
    CreateButton,
    ViewButton,
    EditButton,
    DeleteButton,
    DownloadButton,
} from "@/Components/Button";
import { inertiaGet } from "@/utils/helper-function";
import { BreadcrumbsDevices } from "@/Pages/Devices/Constant";

export default function DevicesIndex({ devices }) {
    const breadcrumbs = [<BreadcrumbsDevices />, "Daftar"];
    const [deleteUserId, setDeleteUserId] = useState(null);
    const modalRef = useRef(null);
    const { post, processing } = useForm();

    const [perPage, setPerPage] = useState(devices.per_page || 10);
    const [search, setSearch] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    // Delete
    function openDeleteModal(id) {
        setDeleteUserId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteUserId(null);
    }

    function handleDelete() {
        if (deleteUserId) {
            post(route("devices.destroy", deleteUserId), {
                onSuccess: () => {
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus data perangkat.");
                },
            });
        }
    }

    function applyFilters(overrides = {}) {
        inertiaGet("devices.index", {
            page: 1,
            per_page: perPage,
            search: search,
            roles: selectedRoles,
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

    // Role
    function toggleRole(roleName) {
        const updatedRoles = selectedRoles.includes(roleName)
            ? selectedRoles.filter((r) => r !== roleName)
            : [...selectedRoles, roleName];

        setSelectedRoles(updatedRoles);
        applyFilters({ roles: updatedRoles });
    }

    // Sort
    function handleSort(field, direction) {
        setSortField(field);
        setSortDirection(direction);
        applyFilters({ sort: field, direction: direction });
    }

    function handleExport() {
        window.location.href = route("devices.export", {
            search: search,
            roles: selectedRoles,
            sort: sortField,
            direction: sortDirection,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Devices" />
            <div className="card shadow-sm w-full">
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
                        <CreateButton
                            route={route("devices.create")}
                            title="Tambah Perangkat"
                        />
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
                                        label="Tipe"
                                        column="type"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="Identitas"
                                        column="identifier"
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                    />
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.data.length === 0 ? (
                                    <TableNotFound
                                        message="Tidak ada perangkat yang ditemukan."
                                        colspan={5}
                                    />
                                ) : (
                                    devices.data.map((device, index) => (
                                        <tr key={device.id}>
                                            <th>
                                                {(devices.current_page - 1) *
                                                    devices.per_page +
                                                    index +
                                                    1}
                                            </th>
                                            <td>{device.name}</td>
                                            <td>{device.type}</td>
                                            <td>{device.identifier}</td>
                                            <td className="flex flex-wrap justify-center items-center gap-2">
                                                <ViewButton
                                                    route={route(
                                                        "devices.view",
                                                        device.id,
                                                    )}
                                                />
                                                <EditButton
                                                    route={route(
                                                        "devices.edit",
                                                        device.id,
                                                    )}
                                                />
                                                <DeleteButton
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            device.id,
                                                        )
                                                    }
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
                            data={devices.links}
                        />
                    </div>
                </div>
            </div>
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="device"
                isDeleting={processing}
            />
        </AuthenticatedLayout>
    );
}
