import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

export const MI_BLACK = "/leaflet/marker-icon-black.png";
export const MI_BLACK_2X = "/leaflet/marker-icon-2x-black.png";
export const MI_BLUE = "/leaflet/marker-icon-blue.png";
export const MI_BLUE_2X = "/leaflet/marker-icon-2x-blue.png";
export const MI_GOLD = "/leaflet/marker-icon-gold.png";
export const MI_GOLD_2X = "/leaflet/marker-icon-2x-gold.png";
export const MI_GREEN = "/leaflet/marker-icon-green.png";
export const MI_GREEN_2X = "/leaflet/marker-icon-2x-green.png";
export const MI_GREY = "/leaflet/marker-icon-grey.png";
export const MI_GREY_2X = "/leaflet/marker-icon-2x-grey.png";
export const MI_ORANGE = "/leaflet/marker-icon-orange.png";
export const MI_ORANGE_2X = "/leaflet/marker-icon-2x-orange.png";
export const MI_RED = "/leaflet/marker-icon-red.png";
export const MI_RED_2X = "/leaflet/marker-icon-2x-red.png";
export const MI_VIOLET = "/leaflet/marker-icon-violet.png";
export const MI_VIOLET_2X = "/leaflet/marker-icon-2x-violet.png";
export const MI_YELLOW = "/leaflet/marker-icon-yellow.png";
export const MI_YELLOW_2X = "/leaflet/marker-icon-2x-yellow.png";
export const MI = markerIcon;
export const MS = markerShadow;
export const MI_2X = markerIcon2x;
export const MOTOR_1 = "/leaflet/motor-1.png";
export const CAR_1 = "/leaflet/car-1.png";
export const BUS_1 = "/leaflet/bus-1.png";
export const TRUCK_1 = "/leaflet/truck-1.png";

export const makeIcon = (icon, icon2x, iconLength = 25, iconHeight = 41) => {
    return new L.Icon({
        iconUrl: icon,
        iconRetinaUrl: icon2x,
        shadowUrl: MS,
        iconSize: [iconLength, iconHeight],
        iconAnchor: [iconLength / 2, 41],
    });
};

// export const makeIconFa = (faIcon) => {
//     const iconHtml = ReactDOMServer.renderToString(faIcon);

//     return L.divIcon({
//         html: iconHtml,
//         className: "",
//         iconSize: [32, 32],
//         iconAnchor: [16, 32],
//     });
// };
