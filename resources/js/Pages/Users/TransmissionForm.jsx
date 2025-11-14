import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Breadcrumbs from "@/Components/Breadcrumbs";
import FormButton from "@/Components/FormButton";
import { InputDropdownManual } from "@/Components/FormInput";
import { BreadcrumbsUsers } from "@/Pages/Users/Constant";

export default function TransmissionForm({ userSelected, transmissions }) {
    const breadcrumbs = [
        <BreadcrumbsUsers />,
        <Link href={route("users.transmissions", userSelected.id)}>
            Transmisi Pengguna - {userSelected.name}
        </Link>,
        "Tambah",
    ];
    const { data, setData, post, put, processing, errors } = useForm({
        id: "",
        user_id: userSelected.id,
        transmission_id: transmissions[0].id || null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("users.transmissions.store", userSelected.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Transmisi Penggua" />

            <div className="card bg-base-100 shadow-sm w-full">
                <div className="card-body">
                    <Breadcrumbs list={breadcrumbs} />
                    <form onSubmit={submit} className="space-y-4 mt-4">
                        <InputDropdownManual
                            isRequired={true}
                            label="Transmisi"
                            value={data.transmission_id}
                            onChange={(e) =>
                                setData("transmission_id", e.target.value)
                            }
                            error={errors.transmission_id}
                            list={transmissions}
                        />
                        <FormButton
                            processing={processing}
                            route={route(
                                "users.transmissions",
                                userSelected.id
                            )}
                            text="Tambah"
                        />
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
