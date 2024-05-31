import Link from 'next/link';

const links = [
    { href: '/object-detection', label: 'Object Detection' },
    { href: '/semantic-search', label: 'Semantic Search' },
];

const SideNav = () => {
    return (
        <div className="sticky h-screen bg-teal-950 shadow-lg text-lime-50 w-64 space-y-6 py-7 px-2 inset-y-0 transform transition-transform duration-200 ease-in-out">
            <Link
                href="/"
                className="text-center block text-lime-950 rounded-xl font-bold bg-lime-400 hover:bg-lime-500 transition-colors duration-300 px-3 py-2">
                Home
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight">Models</h2>
            <nav>
                <ul className="space-y-4">
                    {links.map(({ href, label }) => (
                        <li key={`${href}${label}`}>
                            <Link
                                href={href}
                                className="text-lime-50 font-bold hover:text-lime-200 transition-colors duration-300 px-3 py-2 rounded-md">
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default SideNav;
