import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 justify-center dark:bg-gray-900">
            <div>
                <div className="flex items-center justify-center gap-10 mb-5">
                    <img
                        src="assets/images/kemenhub.png"
                        alt="Kemenhub"
                        className="h-20 object-contain"
                    />
                    <img
                        src="assets/images/pktj.png"
                        alt="PKTJ"
                        className="h-20 object-contain"
                    />
                    <img
                        src="assets/images/bpsdm.png"
                        alt="BPSDM"
                        className="h-20 object-contain"
                    />
                </div>
                <Link href="/" className="flex flex-col flex-wrap items-center">
                    <div className="text-4xl">SIMPROK</div>
                    <div className="text-1xl">
                        Sistem Informasi Monitoring Profil Kecepatan Kendaraan
                    </div>
                </Link>
            </div>
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md max-w-md rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
