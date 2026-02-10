import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import FlashToast from "@/Components/FlashToast";
import Sidebar from "@/Components/Sidebar";
import Lottie from "lottie-react";
import RedCarDrive from "@/assets/lottie/red-car-drive.json";
import { publicAsset } from "@/utils/constants";

export default function AuthenticatedLayout({ children }) {
    const { props } = usePage();
    const userFromUsePage = props.user;

    const userRoleNames =
        userFromUsePage?.roles?.map((role) => role.name) ?? [];

    const [open, setOpen] = useState(
        () => JSON.parse(localStorage.getItem("sidebar-open")) ?? true,
    );

    useEffect(() => {
        localStorage.setItem("sidebar-open", JSON.stringify(open));
    }, [open]);

    const handleLogout = () => {
        router.post(route("logout"), {
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    return (
        <div className="flex h-screen">
            <FlashToast />
            {/* Sidebar */}
            <Sidebar userRoleNames={userRoleNames} open={open} />

            {/* Content area */}
            <div className="flex flex-col h-screen bg-base-100 w-full">
                {/* Sticky Navbar */}
                <div className="navbar h-16 bg-base-100 shadow-sm">
                    <div className="flex-none">
                        <button
                            className="btn btn-square btn-ghost hidden sm:flex"
                            onClick={() => setOpen(!open)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-5 w-5 stroke-current"
                            >
                                {" "}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>{" "}
                            </svg>
                        </button>
                        <div className="drawer flex sm:hidden">
                            <input
                                id="my-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />
                            <div className="drawer-content">
                                {/* Page content here */}
                                <label
                                    htmlFor="my-drawer"
                                    className="btn btn-square btn-ghost drawer-button"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-5 w-5 stroke-current"
                                    >
                                        {" "}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        ></path>{" "}
                                    </svg>
                                </label>
                            </div>
                            <div className="drawer-side">
                                <label
                                    htmlFor="my-drawer"
                                    aria-label="close sidebar"
                                    className="drawer-overlay"
                                ></label>
                                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-0">
                                    {/* Sidebar content here */}
                                    <Sidebar
                                        userRoleNames={userRoleNames}
                                        open={open}
                                        isDrawer={true}
                                    />
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Link
                            className="btn btn-ghost text-xl"
                            href={route("dashboard")}
                        >
                            <div className="text-left">
                                <div className="text-base">SIMPROK</div>
                                <div className="text-xs">
                                    Sistem Informasi Monitoring Profil Kecepatan
                                    Kendaraan
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="dropdown dropdown-end mr-3">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    src={publicAsset("assets/images/pktj.png")}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link
                                    className="justify-between"
                                    href={route("profile.edit")}
                                >
                                    Profil
                                </Link>
                            </li>
                            <li>
                                <Link as="button" onClick={handleLogout}>
                                    Keluar
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <main className="relative flex-1 overflow-y-auto">
                    {/* Background Lottie */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <Lottie
                            animationData={RedCarDrive}
                            loop
                            className="w-[600px] max-w-full"
                        />
                    </div>

                    {/* Foreground Content */}
                    <div className="relative z-5 p-4">{children}</div>
                </main>
            </div>
        </div>
    );
}
