import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";

document.documentElement.setAttribute("data-theme", "light");
document.documentElement.classList.remove("dark");

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        // const user = props.initialPage.props.user;

        root.render(
            // <UserProvider initialUser={user}>
            <App {...props} />,
            // </UserProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
