import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input, InputDropdownManual, InputImage } from "@/Components/FormInput";
import { INVENTORY_CONDITION_OPTIONS } from "@/utils/constants";
import { BreadcrumbsInventories } from "@/Pages/Inventories/Constant";

export default function InventoriesForm({
    inventory = {},
    isEdit = false,
    // categories = [],
    transmissions = [],
}) {
    const breadcrumbs = [
        <BreadcrumbsInventories />,
        isEdit ? "Ubah" : "Tambah",
    ];

    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        name: "",
        brand: "",
        description: "",
        // category_id: 1,
        transmission_id: 1,
        received_at: new Date().toLocaleDateString("en-CA"), // Default to today
        condition: 1,
        photo: null,
        photo_path: null,
    });

    useEffect(() => {
        if (isEdit && inventory) {
            setData({
                id: inventory.id,
                name: inventory.name,
                brand: inventory.brand,
                description: inventory.description || "",
                // category_id: inventory.category_id || 1,
                transmission_id: inventory.transmission_id || 1,
                received_at: inventory.received_at,
                condition: inventory.condition,
                photo: null,
                photo_path: inventory.photo_path || null,
            });
            setPreviewUrl(
                inventory.photo_path ? "/storage/" + inventory.photo_path : null
            );
        }
    }, [isEdit, inventory]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route("inventories.update", data.id));
        } else {
            post(route("inventories.store"));
        }
    };

    const onPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Pilih file gambar yang valid.");
                return;
            }
            setData("photo", file);
            setData("photo_path", null);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData("photo", null);
        }
    };

    const onDeleteHandler = () => {
        setPreviewUrl(null);
        setData("photo", null);
        setData("photo_path", null);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Alat`} />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <Input
                            isRequired={true}
                            type="text"
                            label="Nama"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={errors.name}
                        />
                        <Input
                            // isRequired={true}
                            type="text"
                            label="Merk"
                            placeholder="Merk"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                            error={errors.brand}
                        />
                        <Input
                            type="text"
                            label="Deskripsi"
                            placeholder="Deskripsi"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            error={errors.description}
                        />
                        {/* <InputDropdownManual
                            isRequired={true}
                            label="Category"
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            error={errors.category_id}
                            list={categories.data}
                            labelKey="name"
                            idKey="id"
                        /> */}
                        <InputDropdownManual
                            isRequired={true}
                            label="Transmisi"
                            value={data.transmission_id}
                            onChange={(e) =>
                                setData("transmission_id", e.target.value)
                            }
                            error={errors.transmission_id}
                            list={transmissions.data}
                            labelKey="name"
                            idKey="id"
                        />
                        <Input
                            type="date"
                            label="Tanggal Diterima"
                            placeholder="Tanggal Diterima"
                            value={data.received_at}
                            onChange={(e) =>
                                setData("received_at", e.target.value)
                            }
                            error={errors.received_at}
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Kondisi"
                            value={data.condition}
                            onChange={(e) =>
                                setData("condition", e.target.value)
                            }
                            error={errors.condition}
                            list={INVENTORY_CONDITION_OPTIONS}
                            labelKey="label"
                            idKey="value"
                        />
                        <InputImage
                            label="Foto"
                            value={data.photo}
                            error={errors.photo}
                            onPhotoChange={onPhotoChange}
                            previewUrl={previewUrl}
                            initValue={inventory.photo}
                            onDeleteHandler={onDeleteHandler}
                            accept="image/*"
                        />
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("inventories.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
