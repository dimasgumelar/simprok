import { PAGE_SIZES } from "@/utils/constants";
import { router } from "@inertiajs/react";

export default function Pagination({
    perPage = 10,
    handlePerPageChange,
    data = [],
}) {
    function paginationLabel(label) {
        return label
            .replace("pagination.previous", "<")
            .replace("pagination.next", ">");
    }
    return (
        <div className="my-4 flex">
            <select
                value={perPage}
                onChange={handlePerPageChange}
                className="select w-20"
            >
                {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            <div className="join ml-4">
                {data.map((link, index) => (
                    <button
                        key={index}
                        className={`join-item btn ${
                            link.active ? "btn-active" : ""
                        } ${!link.url ? "btn-disabled" : ""}`}
                        dangerouslySetInnerHTML={{
                            __html: paginationLabel(link.label),
                        }}
                        onClick={() => {
                            if (link.url) {
                                router.get(
                                    link.url,
                                    {},
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    }
                                );
                            }
                        }}
                    ></button>
                ))}
            </div>
        </div>
    );
}
