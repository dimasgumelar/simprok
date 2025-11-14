export default function Breadcrumbs({ list = [] }) {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
