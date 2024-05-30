import Link from 'next/link';

const SideNav = () => {
    return (
        <div className="h-screen bg-teal-950 shadow-lg text-lime-50 w-64 space-y-6 py-7 px-2 inset-y-0 transform transition-transform duration-200 ease-in-out">
            <div className="flex w-full justify-between px-2 items-center">
                <h2 className="text-2xl font-extrabold tracking-tight">Models</h2>
                <Link
                    href="/"
                    className="text-lime-50 font-bold hover:text-lime-200 transition-colors duration-300 px-3 py-2 rounded-md">
                    Home
                </Link>
            </div>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link
                            href="/object-detection"
                            className="text-lime-50 font-bold hover:text-lime-200 transition-colors duration-300 px-3 py-2 rounded-md">
                            Object Detection
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/model2"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Model 2
                        </Link>
                    </li>
                    {/* Add more links for each model */}
                </ul>
            </nav>
        </div>
    );
};

export default SideNav;