import { COLOR_ERROR, COLOR_PRIMARY } from "@/utils/constants";
import React from "react";

export default function SpeedometerCircle({ speed = 0, max = 100 }) {
    const percentage = Math.min(speed / max, 1);
    const angle = percentage * 180;

    return (
        <div className="flex flex-col items-center">
            <svg
                width="140"
                height="100"
                viewBox="0 0 100 50"
                style={{ overflow: "visible" }}
            >
                {/* Background arc */}
                <path
                    d="M10 40 A40 40 0 0 1 90 40"
                    fill="none"
                    stroke="#ddd"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Colored arc */}
                <path
                    d="M10 40 A40 40 0 0 1 90 40"
                    fill="none"
                    stroke={COLOR_PRIMARY}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="126"
                    strokeDashoffset={126 - 126 * percentage}
                />

                {/* Needle */}
                <line
                    x1="50"
                    y1="40"
                    x2={50 + 30 * Math.cos((Math.PI * (180 - angle)) / 180)}
                    y2={40 - 30 * Math.sin((Math.PI * (180 - angle)) / 180)}
                    stroke={COLOR_ERROR}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                {/* Speed text */}
                <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                >
                    {speed} km/h
                </text>
            </svg>
        </div>
    );
}
