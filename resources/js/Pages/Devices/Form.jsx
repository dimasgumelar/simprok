import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { Input, InputDropdownManual } from "@/Components/FormInput";
import { UPPER, LOWER, NUMBER } from "@/utils/constants";
import { BreadcrumbsDevices } from "@/Pages/Devices/Constant";

export default function DevicesForm({ device = {}, types, isEdit = false }) {
    const breadcrumbs = [<BreadcrumbsDevices />, isEdit ? "Ubah" : "Tambah"];
    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        name: "",
        type: "",
        identifier: "",
    });

    useEffect(() => {
        if (isEdit && device) {
            setData({
                id: device.id,
                name: device.name,
                type: device.type,
                identifier: device.identifier,
            });
        }
    }, [isEdit, device]);

    const generatePassword = () => {
        const all = UPPER + LOWER + NUMBER;
        let result = "";
        result += UPPER[Math.floor(Math.random() * UPPER.length)];
        result += LOWER[Math.floor(Math.random() * LOWER.length)];
        result += NUMBER[Math.floor(Math.random() * NUMBER.length)];

        while (result.length < 8) {
            result += all[Math.floor(Math.random() * all.length)];
        }
        const shuffled = result
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("");
        setData("password", shuffled);
    };

    useEffect(() => {
        if (!isEdit) generatePassword();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("devices.update", device.id));
        } else {
            post(route("devices.store"));
        }
    };

    const onChangeInputHandler = (key, e) => {
        setData(key, e.target.value);
        errors[key] = null;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Pengguna`} />

            <div className="card shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <Input
                            isRequired={true}
                            type="text"
                            label="Nama"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => onChangeInputHandler("name", e)}
                            error={errors.name}
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Tipe"
                            value={data.type}
                            onChange={(e) => onChangeInputHandler("type", e)}
                            error={errors.type}
                            list={types}
                            idKey="value"
                            labelKey="label"
                        />
                        {isEdit && (
                            <Input
                                disabled={true}
                                type="text"
                                label="Identitas"
                                placeholder="Identitas"
                                value={data.identifier}
                            />
                        )}
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("devices.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
