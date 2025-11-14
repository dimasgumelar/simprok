import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit() {
    return (
        <AuthenticatedLayout>
            <Head title="Profil" />
            <UpdateProfileInformationForm />
            <UpdatePasswordForm />
        </AuthenticatedLayout>
    );
}
