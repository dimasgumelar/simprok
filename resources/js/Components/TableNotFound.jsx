export default function TableNotFound({
    message = "No items found",
    colspan = 1,
}) {
    return (
        <tr>
            <td colSpan={colspan} className="text-center py-4">
                {message}
            </td>
        </tr>
    );
}
