import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { FaSyncAlt } from "react-icons/fa";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import {
    Input,
    InputButton,
    InputDropdownManual,
} from "@/Components/FormInput";
import { UPPER, LOWER, NUMBER } from "@/utils/constants";
import { BreadcrumbsUsers } from "@/Pages/Users/Constant";

export default function UsersForm({ user = {}, roles, isEdit = false }) {
    const breadcrumbs = [<BreadcrumbsUsers />, isEdit ? "Ubah" : "Tambah"];
    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "",
    });

    useEffect(() => {
        if (isEdit && user) {
            setData({
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                password: "",
                role: user.roles.length > 0 ? user.roles[0].id : "",
            });
        }
    }, [isEdit, user]);

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
            put(route("users.update", user.id));
        } else {
            post(route("users.store"));
        }
    };

    const onChangeInputHandler = (key, e) => {
        setData(key, e.target.value);
        errors[key] = null;
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${isEdit ? "Ubah" : "Tambah"} Pengguna`} />

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
                            onChange={(e) => onChangeInputHandler("name", e)}
                            error={errors.name}
                        />
                        <Input
                            isRequired={true}
                            type="text"
                            label="Telepon"
                            placeholder="Telepon"
                            value={data.phone}
                            onChange={(e) => onChangeInputHandler("phone", e)}
                            error={errors.name}
                        />
                        <Input
                            isRequired={true}
                            type="email"
                            label="Email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => onChangeInputHandler("email", e)}
                            error={errors.email}
                            disabled={isEdit}
                        />
                        <InputButton
                            isRequired={!isEdit}
                            type="text"
                            label="Kata Sandi"
                            placeholder="Kata Sandi"
                            value={data.password}
                            onChange={(e) =>
                                onChangeInputHandler("password", e)
                            }
                            error={errors.password}
                            onClick={generatePassword}
                            iconButton={<FaSyncAlt />}
                            labelButton="Buat secara otomatis"
                            isManual={isEdit}
                            manual="Kosongkan kolom kata sandi jika tidak ingin mengubahnya."
                        />
                        <InputDropdownManual
                            isRequired={true}
                            label="Peran"
                            value={data.role}
                            onChange={(e) => onChangeInputHandler("role", e)}
                            error={errors.role}
                            list={roles}
                        />
                        <FormButton
                            processing={processing}
                            isEdit={isEdit}
                            route={route("users.index")}
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
