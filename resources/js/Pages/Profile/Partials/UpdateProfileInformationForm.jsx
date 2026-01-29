import { useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({ className = "" }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <div className="card shadow-sm w-full">
            <div className="card-body pb-0">
                <form onSubmit={submit} className="">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">
                            Informasi Profil
                        </legend>

                        <label className="label">Nama</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Nama"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            autoComplete="name"
                        />
                        {errors.name && (
                            <div className="text-error text-sm mt-1">
                                {errors.name}
                            </div>
                        )}

                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="Email"
                            disabled
                            value={data.email}
                        />
                        <div>
                            <button
                                type="submit"
                                className={`btn ${
                                    processing
                                        ? "btn-disabled"
                                        : recentlySuccessful
                                          ? "btn-success"
                                          : "btn-primary"
                                } mt-4`}
                                disabled={processing}
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : recentlySuccessful
                                      ? "Tersimpan"
                                      : "Simpan"}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
