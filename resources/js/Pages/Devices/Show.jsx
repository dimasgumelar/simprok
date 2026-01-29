import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { FormButtonLink } from "@/Components/FormButton";
import { FaEdit } from "react-icons/fa";
import { BreadcrumbsDevices } from "@/Pages/Devices/Constant";
import { parseDateTime } from "@/utils/helper-function";

export default function DevicesShow({ device = {} }) {
    const breadcrumbs = [<BreadcrumbsDevices />, "View"];

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Perangkat" />

            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Nama</th>
                                    <td>{device.name}</td>
                                </tr>
                                <tr>
                                    <th>Tipe</th>
                                    <td>{device.type}</td>
                                </tr>
                                <tr>
                                    <th>Identitas</th>
                                    <td>{device.identifier}</td>
                                </tr>
                                <tr>
                                    <th>Tanggal Ditambahkan</th>
                                    <td>{parseDateTime(device.created_at)}</td>
                                </tr>
                                <tr>
                                    <th>Terakhir Diubah</th>
                                    <td>{parseDateTime(device.updated_at)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <FormButtonLink
                            backRoute={route("devices.index")}
                            route={route("devices.edit", device.id)}
                            text="Ubah"
                            icon={<FaEdit />}
                            buttonColor="btn-success"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
