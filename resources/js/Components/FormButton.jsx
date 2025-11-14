import { Link } from "@inertiajs/react";
import { FaPlus, FaArrowLeft, FaEdit, FaSpinner } from "react-icons/fa";

export default function FormButton({
    processing = false,
    isEdit = false,
    route = "",
    text = "",
}) {
    return (
        <div className="flex justify-end">
            <Link href={route} className="btn btn-secondary mr-2">
                <FaArrowLeft />
                <span>Kembali</span>
            </Link>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={processing}
            >
                {processing ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : text != "" ? (
                    <>
                        <FaPlus />
                        {text}
                    </>
                ) : isEdit ? (
                    <>
                        <FaEdit />
                        Ubah
                    </>
                ) : (
                    <>
                        <FaPlus /> Tambah
                    </>
                )}
            </button>
        </div>
    );
}

export function FormButtonLink({
    backRoute = "",
    route = "",
    text = "Tambah",
    icon = <FaPlus />,
    buttonColor = "btn-primary",
}) {
    return (
        <div className="flex justify-end">
            <Link href={backRoute} className="btn btn-secondary mr-2">
                <FaArrowLeft />
                <span>Kembali</span>
            </Link>
            {route != "" && (
                <Link href={route} className={`btn ${buttonColor}`}>
                    {icon}
                    <span>{text}</span>
                </Link>
            )}
        </div>
    );
}

export function FormButtonSubmit({
    backRoute = "",
    text = "Tambah",
    icon = <FaPlus />,
    buttonColor = "btn-primary",
    isSubmit = true,
    isLoading = false,
}) {
    return (
        <div className="flex justify-end mt-2">
            <Link href={backRoute} className="btn btn-secondary mr-2">
                <FaArrowLeft />
                <span>Kembali</span>
            </Link>
            {isSubmit && (
                <button
                    type="submit"
                    className={`btn ${buttonColor} flex items-center gap-2`}
                    disabled={isLoading}
                >
                    {isLoading ? <FaSpinner className="animate-spin" /> : icon}
                    <span>{isLoading ? "Proses..." : text}</span>
                </button>
            )}
        </div>
    );
}

export function FormButtonFunction({
    backRoute = "",
    text = "Tambah",
    icon = <FaPlus />,
    buttonColor = "btn-primary",
    isLoading = false,
    onClick,
    isButton = true,
}) {
    return (
        <div className="flex justify-end mt-2">
            <Link href={backRoute} className="btn btn-secondary mr-2">
                <FaArrowLeft />
                <span>Kembali</span>
            </Link>
            {isButton && (
                <button
                    onClick={onClick}
                    className={`btn ${buttonColor} flex items-center gap-2`}
                    disabled={isLoading}
                >
                    {isLoading ? <FaSpinner className="animate-spin" /> : icon}
                    <span>{isLoading ? "Proses..." : text}</span>
                </button>
            )}
        </div>
    );
}
