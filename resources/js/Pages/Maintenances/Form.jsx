import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import DeleteModal from "@/Components/DeleteModal";
import { FileModal } from "@/Components/Modal";
import { Input, InputDropdownManual, InputFile } from "@/Components/FormInput";
import { DateTimeInput } from "@/Components/Flatpickr";
import { inertiaGet } from "@/utils/helper-function";
import { STATUS_LIST } from "@/utils/constants";
import { FaUpload, FaEye, FaTrash } from "react-icons/fa";
import { BreadcrumbsMaintenances } from "@/Pages/Maintenances/Constant";

export default function MaintenancesForm({
    maintenance = {},
    transmissions = [],
    inventories = [],
    users = [],
    feedbacks = [],
    isEdit = false,
}) {
    const breadcrumbs = [
        <BreadcrumbsMaintenances />,
        isEdit ? "Ubah" : "Tambah",
    ];

    const [transmissionsList, setTransmissionsList] = useState(
        transmissions || []
    );
    const [inventoriesList, setInventoriesList] = useState(inventories || []);
    const [usersList, setUsersList] = useState(users || []);
    const [uploadedFiles, setUploadedFiles] = useState(feedbacks || []);
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteFeedbackId, setDeleteInventoryId] = useState(null);

    const maintenanceForm = useForm({
        id: "",
        transmission_id: maintenance.transmission_id || "",
        inventory_id: maintenance.inventory_id || "",
        user_id: maintenance.user_id || "",
        description: maintenance.description || "",
        scheduled_at: maintenance.scheduled_at || "",
        status: maintenance.status || 0,
    });

    const feedbackForm = useForm({
        description: "",
        feedback: "",
        file: null,
    });
    const { delete: destroy } = useForm();

    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        inventories.map((value, index) => {
            inventories[index].name =
                "[" + value.inventory_code + "] " + value.name;
            // +
            // (value.brand ? " - " + value.brand : "");
        });
        setInventoriesList(inventories || []);
        setUsersList(users || []);
        if (isEdit && maintenance) {
            maintenanceForm.setData({
                id: maintenance.id,
                transmission_id: maintenance.transmission_id || "",
                inventory_id: maintenance.inventory_id || "",
                user_id: maintenance.user_id || "",
                description: maintenance.description || "",
                scheduled_at: maintenance.scheduled_at || "",
                status: maintenance.status || 0,
            });
        }
    }, [isEdit, maintenance, users, inventories]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            maintenanceForm.post(
                route("maintenances.update", maintenanceForm.data.id)
            );
        } else {
            maintenanceForm.post(route("maintenances.store"));
        }
    };

    const onInventoryChange = (inventory_id) => {
        maintenanceForm.setData("inventory_id", inventory_id);
    };

    const onTransmissionChange = (transmission_id) => {
        maintenanceForm.setData("transmission_id", transmission_id);
        if (isEdit) {
            inertiaGet(
                "maintenances.edit",
                {
                    transmission_id: transmission_id,
                },
                maintenance.id
            );
        } else {
            inertiaGet("maintenances.create", {
                transmission_id: transmission_id,
            });
        }
    };

    const onUserChange = (user_id) => {
        maintenanceForm.setData("user_id", user_id);
    };

    const onScheduleChange = (selectedDates, dateStr, instance) => {
        if (selectedDates.length > 0) {
            const date = selectedDates[0];

            // ubah ke format "YYYY-MM-DD HH:mm:ss"
            const formattedDate =
                date.getFullYear() +
                "-" +
                String(date.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(date.getDate()).padStart(2, "0") +
                " " +
                String(date.getHours()).padStart(2, "0") +
                ":" +
                String(date.getMinutes()).padStart(2, "0") +
                ":" +
                String(date.getSeconds()).padStart(2, "0");

            maintenanceForm.setData("scheduled_at", formattedDate);
        }
    };
    // const onScheduleChange = (datetime) => {
    //     const now = new Date().toISOString().slice(0, 16);

    //     if (datetime < now) {
    //         maintenanceForm.setData("scheduled_at", now);
    //     } else {
    //         maintenanceForm.setData("scheduled_at", datetime);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let formData = new FormData();
            formData.append("file", feedbackForm.data.file);
            formData.append("description", feedbackForm.data.description);

            const res = await axios.post(
                route("feedbacks.store", maintenance.id),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            // update state dari response
            setUploadedFiles((prev) => [...prev, res.data]);
            feedbackForm.setData("file", null);
            feedbackForm.setData("description", "");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                alert("Pilih file gambar atau video yang valid.");
                return;
            }
            feedbackForm.setData("file", file);
        } else {
            feedbackForm.setData("file", null);
        }
    };

    function handleDelete() {
        if (deleteFeedbackId) {
            destroy(route("feedbacks.destroy", deleteFeedbackId), {
                method: "post",
                data: { _method: "delete" },
                onSuccess: () => {
                    setUploadedFiles((prev) =>
                        prev.filter((f) => f.id !== deleteFeedbackId)
                    );
                    closeDeleteModal();
                },
                onError: () => {
                    alert("Gagal menghapus dokumen.");
                },
            });
        }
    }

    function openDeleteModal(id) {
        setDeleteInventoryId(id);
        modalRef.current.showModal();
    }

    function closeDeleteModal() {
        modalRef.current.close();
        setDeleteInventoryId(null);
    }

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Pemeliharaan`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <InputDropdownManual
                            isRequired={true}
                            label="Transmisi"
                            value={maintenanceForm.data.transmission_id}
                            onChange={(e) =>
                                onTransmissionChange(e.target.value)
                            }
                            error={maintenanceForm.errors.transmission_id}
                            list={transmissionsList}
                            labelKey="name"
                            idKey="id"
                        />
                        <InputDropdownManual
                            disabled={inventoriesList.length === 0}
                            isRequired={true}
                            label="Alat"
                            value={maintenanceForm.data.inventory_id}
                            onChange={(e) => onInventoryChange(e.target.value)}
                            error={maintenanceForm.errors.inventory_id}
                            list={inventoriesList}
                            labelKey="name"
                            idKey="id"
                        />
                        <InputDropdownManual
                            disabled={
                                inventoriesList.length === 0 ||
                                usersList.length === 0
                            }
                            isRequired={true}
                            label="Pengguna"
                            value={maintenanceForm.data.user_id}
                            onChange={(e) => onUserChange(e.target.value)}
                            error={maintenanceForm.errors.user_id}
                            list={usersList}
                            labelKey="name"
                            idKey="user_id"
                        />
                        <Input
                            type="text"
                            label="Deskripsi"
                            placeholder="Deskripsi"
                            value={maintenanceForm.data.description}
                            onChange={(e) =>
                                maintenanceForm.setData(
                                    "description",
                                    e.target.value
                                )
                            }
                            error={maintenanceForm.errors.description}
                        />
                        {/* <Input
                            type="datetime-local"
                            label="Jadwal"
                            isRequired={true}
                            placeholder="Jadwal"
                            value={maintenanceForm.data.scheduled_at}
                            onChange={(e) => onScheduleChange(e.target.value)}
                            error={maintenanceForm.errors.scheduled_at}
                            min={new Date().toISOString().slice(0, 16)}
                        /> */}
                        <DateTimeInput
                            label="Jadwal"
                            isRequired={true}
                            error={maintenanceForm.errors.scheduled_at}
                            placeholder="Pilih waktu penjadwalan"
                            minDate="today"
                            onChange={(selectedDates, dateStr, instance) =>
                                onScheduleChange(
                                    selectedDates,
                                    dateStr,
                                    instance
                                )
                            }
                        />
                        {isEdit && (
                            <InputDropdownManual
                                disabled={
                                    inventoriesList.length === 0 ||
                                    usersList.length === 0
                                }
                                isRequired={true}
                                label="Status"
                                value={maintenanceForm.data.status}
                                onChange={(e) =>
                                    maintenanceForm.setData(
                                        "status",
                                        e.target.value
                                    )
                                }
                                error={maintenanceForm.errors.status}
                                list={STATUS_LIST}
                                labelKey="label"
                                idKey="value"
                            />
                        )}
                        {isEdit && (
                            <div className="mb-2">
                                Media ({uploadedFiles.length}/5)
                            </div>
                        )}
                        {uploadedFiles.length < 5 && isEdit && (
                            <div className="space-y-4 mt-2">
                                <InputFile
                                    ref={fileInputRef}
                                    label="Dokumen"
                                    placeholder="Dokumen"
                                    onChange={onFileChange}
                                    error={feedbackForm.errors.file}
                                ></InputFile>
                                <Input
                                    type="text"
                                    label="Deskripsi"
                                    placeholder="Deskripsi"
                                    value={feedbackForm.data.description}
                                    onChange={(e) =>
                                        feedbackForm.setData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    error={feedbackForm.errors.description}
                                />
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    <FaUpload /> Upload
                                </button>
                            </div>
                        )}
                        {uploadedFiles.map((f, i) => (
                            <div className="flex items-start pr-5 pt-4" key={i}>
                                <div className="flex items-center mr-5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(f);
                                            document
                                                .getElementById(
                                                    "preview_file_modal"
                                                )
                                                .showModal();
                                        }}
                                        className="btn btn-primary mr-1"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openDeleteModal(f.id)}
                                        className="btn btn-error mr-5"
                                    >
                                        <FaTrash />
                                    </button>
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
                                            <div>Tipe file tidak didukung</div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full">{f.description}</div>
                            </div>
                        ))}
                        <FormButton
                            processing={maintenanceForm.processing}
                            isEdit={isEdit}
                            route={route("maintenances.index")}
                        />
                    </form>
                </div>
            </div>
            <FileModal selectedFile={selectedFile} />
            <DeleteModal
                modalRef={modalRef}
                onCancel={closeDeleteModal}
                onConfirm={handleDelete}
                title="laporan"
            />
        </AuthenticatedLayout>
    );
}
