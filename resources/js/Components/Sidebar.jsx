import { Link } from "@inertiajs/react";
import { list } from "postcss";
import { useState, useEffect } from "react";
import {
    FaHome,
    FaUser,
    FaChevronDown,
    FaSatelliteDish,
    FaTachometerAlt,
    FaMap,
    FaListAlt,
    FaFolder,
} from "react-icons/fa";

export default function Sidebar({
    userRoleNames,
    open = true,
    isDrawer = false,
}) {
    const [openMenu, setOpenMenu] = useState(null);

    const isActive = (routeStr) => {
        if (!routeStr) return false;
        return route().current(routeStr);
    };

    const isChildActive = (list) => {
        if (!list) return false;
        return list.some((child) => isActive(child.routeStr));
    };

    const hasAccess = (roles) => roles.includes(userRoleNames[0]);

    const menuItemsGroup = [
        {
            label: "Beranda",
            icon: <FaHome />,
            routeStr: "dashboard",
            roles: ["admin", "operator"],
        },
        {
            label: "Master Data",
            icon: <FaFolder />,
            roles: ["admin"],
            list: [
                {
                    label: "Pengguna",
                    icon: <FaUser />,
                    routeStr: "users.index",
                    roles: ["admin"],
                },
                {
                    label: "Perangkat",
                    icon: <FaSatelliteDish />,
                    routeStr: "devices.index",
                    roles: ["admin"],
                },
            ],
        },
        {
            label: "GPS Log",
            icon: <FaListAlt />,
            routeStr: "gpslogs.index",
            roles: ["admin", "operator"],
        },
        {
            label: "Kecepatan",
            icon: <FaTachometerAlt />,
            routeStr: "gps.speed",
            roles: ["admin", "operator"],
        },
        {
            label: "Peta",
            icon: <FaMap />,
            routeStr: "gps.map",
            roles: ["admin", "operator"],
        },
        {
            label: "Trip",
            icon: <FaMap />,
            routeStr: "gps.map",
            roles: ["admin", "operator"],
        },
    ];

    useEffect(() => {
        menuItemsGroup.forEach((menu, index) => {
            if (menu.list && isChildActive(menu.list)) {
                setOpenMenu(index);
            }
        });
    }, []);

    return (
        <aside
            className={`${isDrawer ? "" : "hidden sm:flex"} min-h-screen ${
                isDrawer ? "" : open ? "w-60" : "w-16"
            }`}
        >
            <nav
                className={`z-[999] p-2 space-y-1 ${
                    isDrawer ? "" : open ? "w-60" : "w-16"
                }`}
            >
                {menuItemsGroup.map((menu, index) => {
                    if (!hasAccess(menu.roles)) return null;

                    // MENU DENGAN CHILD
                    if (menu.list) {
                        const isOpen = openMenu === index;

                        return (
                            <div
                                key={index}
                                className="min-h-[36px]"
                                data-tip={menu.label}
                            >
                                <button
                                    data-tip={menu.label}
                                    onClick={() =>
                                        setOpenMenu(isOpen ? null : index)
                                    }
                                    className={`tooltip tooltip-right min-h-[36px] flex items-center justify-between w-full px-4 py-2 rounded ${
                                        isChildActive(menu.list)
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm">
                                            {menu.icon}
                                        </span>
                                        {open && (
                                            <span className="text-sm text-left">
                                                {menu.label}
                                            </span>
                                        )}
                                    </div>

                                    <FaChevronDown
                                        className={`transition-transform text-sm ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* CHILD */}
                                {
                                    <div
                                        className={`space-y-1 transition-all duration-300 ease-in-out ${
                                            isOpen
                                                ? "mt-1 max-h-96 opacity-100 translate-y-0"
                                                : "max-h-0 opacity-0 -translate-y-1"
                                        }`}
                                    >
                                        {menu.list.map((child, cIndex) => {
                                            if (!hasAccess(child.roles))
                                                return null;

                                            return (
                                                <Link
                                                    data-tip={child.label}
                                                    key={cIndex}
                                                    href={route(child.routeStr)}
                                                    className={`tooltip tooltip-right min-h-[36px] flex items-center gap-3 px-4 py-2 rounded text-sm
                                                                    ${
                                                                        isActive(
                                                                            child.routeStr
                                                                        )
                                                                            ? "bg-primary text-white"
                                                                            : "hover:bg-primary hover:text-white"
                                                                    } ${
                                                        open ? "ml-8" : ""
                                                    }`}
                                                >
                                                    {child.icon}
                                                    {open && (
                                                        <span>
                                                            {child.label}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        );
                    }

                    // MENU TANPA CHILD
                    return (
                        <Link
                            data-tip={menu.label}
                            key={index}
                            href={route(menu.routeStr)}
                            className={`tooltip tooltip-right flex items-center gap-3 px-4 py-2 rounded text-sm min-h-[36px]
                                            ${
                                                isActive(menu.routeStr)
                                                    ? "bg-primary text-white"
                                                    : "hover:bg-primary hover:text-white"
                                            }`}
                        >
                            <span className="">{menu.icon}</span>
                            {open && <span>{menu.label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
