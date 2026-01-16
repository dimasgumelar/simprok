export const INERTIA_OPTIONS = {
    preserveState: true,
    replace: true,
};

// Default pagination size options
export const PAGE_SIZES = [10, 25, 50, 100];

export const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LOWER = "abcdefghijklmnopqrstuvwxyz";
export const NUMBER = "0123456789";

export const BADGE_LIST = [
    "badge-primary",
    "badge-secondary",
    "badge-accent",
    "badge-success",
    "badge-info",
    "badge-warning",
];

export const INVENTORY_CONDITION_OPTIONS = [
    { value: 1, label: "Baik" },
    { value: 2, label: "Cukup" },
    { value: 3, label: "Buruk" },
];

export const TRANSMISSION_STATUS_OPTIONS = [
    { value: 1, label: "Aktif" },
    { value: 0, label: "Tidak Aktif" },
];

export const DEFAULT_IMAGE = "/storage/tvri.jpg";

export const STATUS_LIST = [
    {
        value: 0,
        label: "Menunggu",
    },
    {
        value: 1,
        label: "Dalam Proses",
    },
    {
        value: 2,
        label: "Selesai",
    },
];

export const MQTT_BROKE_URL =
    "wss://rf60f168.ala.asia-southeast1.emqxsl.com:8084/mqtt";
export const MQTT_USERNAME = "simprok-web";
export const MQTT_PASSWORD = "simprok-web";
export const MQTT_TOPIC = "testtopic/1";
export const MQTT_CLIENT_ID = () => {
    return "emqx_test_" + Math.random().toString(16).substring(2, 8);
};

export const FONT_FAMILY =
    'Figtree, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
