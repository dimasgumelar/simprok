import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body pb-0">
                <form onSubmit={updatePassword}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">
                            Ubah Kata Sandi
                        </legend>

                        <label className="label">Kata Sandi Saat Ini</label>
                        <input
                            className="input"
                            placeholder="Kata Sandi Saat Ini"
                            required
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData("current_password", e.target.value)
                            }
                            type="password"
                            autoComplete="current-password"
                        />
                        {errors.current_password && (
                            <div className="text-error text-sm mt-1">
                                {errors.current_password}
                            </div>
                        )}
                        <label className="label">Kata Sandi Baru</label>
                        <input
                            className="input"
                            placeholder="Kata Sandi Baru"
                            required
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <div className="text-error text-sm mt-1">
                                {errors.password}
                            </div>
                        )}
                        <label className="label">Konfirmasi Kata Sandi</label>
                        <input
                            className="input"
                            placeholder="Konfirmasi Kata Sandi"
                            required
                            ref={currentPasswordInput}
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && (
                            <div className="text-error text-sm mt-1">
                                {errors.password_confirmation}
                            </div>
                        )}
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
