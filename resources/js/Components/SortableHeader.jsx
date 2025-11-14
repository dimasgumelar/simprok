import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function SortableHeader({
    label,
    column,
    sortField,
    sortDirection,
    onSort,
    isSort = true,
}) {
    const renderIcon = () => {
        if (sortField !== column) return <FaSort className="ml-2" />;
        if (sortDirection === "asc") return <FaSortUp className="ml-2" />;
        if (sortDirection === "desc") return <FaSortDown className="ml-2" />;
        return <FaSort className="ml-2" />;
    };

    const handleClick = () => {
        if (isSort) {
            let direction = "asc";

            if (sortField === column) {
                if (sortDirection === "asc") direction = "desc";
                else if (sortDirection === "desc") direction = "";
                else direction = "asc";
            }

            onSort(direction === "" ? "" : column, direction);
        }
    };

    return (
        <th className="cursor-pointer select-none" onClick={handleClick}>
            <div className="flex items-center justify-between">
                {label}
                {renderIcon()}
            </div>
        </th>
    );
}
