import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { BadgeStatus } from "@/Components/Badge";
import { FormButtonFunction } from "@/Components/FormButton";
import { FaCheck } from "react-icons/fa";
import { BreadcrumbsMaintenances } from "@/Pages/Maintenances/Constant";
import { parseDateTime, showValueOrDash } from "@/utils/helper-function";
import { FileModal } from "@/Components/Modal";

export default function MaintenancesShow({
    maintenance = {},
    transmission = {},
    inventory = {},
    user_maintenance = {},
    feedbacks = [],
    created_by_user = {},
}) {
    const breadcrumbs = [<BreadcrumbsMaintenances />, "Lihat"];
    const [selectedFile, setSelectedFile] = useState(null);

    function handleApproveMaintenance() {
        setLoadingId(maintenance.id);
        post(route("tasks.start", maintenance.id), {
            preserveScroll: true,
            onFinish: () => setLoadingId(null), // reset setelah selesai
            onError: () => {
                alert("Gagal menyetujui pemeliharan.");
                setLoadingId(null);
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Lihat Pemeliharaan" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Alat</th>
                                    <td>
                                        <Link
                                            href={route(
                                                "inventories.view",
                                                inventory.id
                                            )}
                                        >
                                            [{inventory.inventory_code}]{" "}
                                            {showValueOrDash(inventory.name)} -{" "}
                                            {showValueOrDash(inventory.brand)}
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Transmisi</th>
                                    <td>
                                        {showValueOrDash(transmission.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Pengguna</th>
                                    <td>
                                        {showValueOrDash(user_maintenance.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Dibuat Oleh</th>
                                    <td>
                                        {showValueOrDash(created_by_user.name)}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>
                                        <BadgeStatus
                                            param={maintenance.status}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Deskripsi</th>
                                    <td>
                                        {showValueOrDash(
                                            maintenance.description
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Waktu Dijadwalkan</th>
                                    <td>
                                        {parseDateTime(
                                            maintenance.scheduled_at
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Waktu Dalam Proses</th>
                                    <td>
                                        {parseDateTime(
                                            maintenance.inprogress_at
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Waktu Selesai</th>
                                    <td>
                                        {parseDateTime(
                                            maintenance.completed_at
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th colSpan="2">
                                        <div className="mb-2">
                                            Media ({feedbacks.length}/5)
                                        </div>
                                        {feedbacks.map((f, i) => (
                                            <div
                                                className="flex items-start pr-5 pt-4"
                                                key={i}
                                            >
                                                <div className="flex items-center mr-5">
                                                    <div
                                                        className="w-[100px] h-[100px] cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedFile(f);
                                                            document
                                                                .getElementById(
                                                                    "preview_file_modal"
                                                                )
                                                                .showModal();
                                                        }}
                                                    >
                                                        {f.file_path.match(
                                                            /\.(jpg|jpeg|png|gif|webp)$/i
                                                        ) ? (
                                                            <img
                                                                src={`/storage/${f.file_path}`}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : f.file_path.match(
                                                              /\.(mp4|mov|avi|mkv|webm)$/i
                                                          ) ? (
                                                            <video
                                                                src={`/storage/${f.file_path}`}
                                                                // controls
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div>
                                                                Tipe file tidak
                                                                didukung
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    {f.description}
                                                </div>
                                            </div>
                                        ))}
                                    </th>
                                </tr>
                                <tr>
                                    <th className="text-start">
                                        Laporan Pemeliharaan
                                    </th>
                                    <td>
                                        {showValueOrDash(maintenance.feedback)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <FormButtonFunction
                            backRoute={route("maintenances.index")}
                            text="Setujui"
                            icon={<FaCheck />}
                            buttonColor="btn-success"
                            onClick={handleApproveMaintenance}
                            isButton={maintenance.status == 2}
                        />
                        {/* <FormButtonFunction
                            backRoute={route("tasks.index")}
                            route={route("tasks.start", maintenance.id)}
                            buttonColor="bg-success"
                            text="Mulai"
                            icon={<FaPlay />}
                            isLoading={processing}
                            onClick={handleStartTask}
                        /> */}
                    </div>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
        </AuthenticatedLayout>
    );
}
