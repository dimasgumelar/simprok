import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

export default function FlashToast() {
    const { props } = usePage();
    const { flash } = props;
    const [message, setMessage] = useState(null);
    const [type, setType] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType("success");
        } else if (flash?.error) {
            setMessage(flash.error);
            setType("error");
        }

        // Auto hide after 5 seconds
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => {
                setMessage(null);
                setType(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!message) return null;

    return (
        <div className="toast toast-top toast-end z-[9999]">
            <div
                className={`alert ${
                    type === "success" ? "alert-success" : "alert-error"
                } shadow-lg`}
            >
                <span>{message}</span>
            </div>
        </div>
    );
}
