import { usePage } from "@inertiajs/react";

export default function Roles() {
    const { props } = usePage();
    const userFromUsePage = props.user;

    const role = {
        hasAdmin: userFromUsePage.roles.some((role) => role.name === "admin"),
        hasOperator: userFromUsePage.roles.some(
            (role) => role.name === "operator",
        ),
    };

    return { userFromUsePage, role };
}
