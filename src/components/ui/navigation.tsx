'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useState } from 'react';
import { BiMenuAltLeft } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';

const links = [
    { href: '/object-detection', label: 'Object Detection' },
    { href: '/semantic-search', label: 'Semantic Search' },
];

const SideNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSideNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button onClick={toggleSideNav} type="button" className="h-fit lg:hidden fixed top-2 left-2">
                <BiMenuAltLeft className="text-3xl m-2" />
            </button>

            <div
                className={cn(
                    'fixed top-0 left-0 bg-opacity-90 h-2/3 z-50 rounded-br-xl lg:rounded-none lg:h-screen bg-teal-950 shadow-lg text-lime-50 w-64 space-y-6 pt-2 pb-7 px-2 transform transition-transform duration-500 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:translate-x-0 lg:sticky lg:block'
                )}>
                <div className="flex justify-end pr-2 lg:hidden">
                    <button type="button">
                        <RiCloseLine
                            onClick={toggleSideNav}
                            className={cn('text-4xl text-lime-50 hover:text-lime-200 transition-colors duration-300')}
                        />
                    </button>
                </div>

                <Link
                    onClick={toggleSideNav}
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
                                    onClick={toggleSideNav}
                                    href={href}
                                    className="text-lime-50 font-bold hover:text-lime-200 transition-colors duration-300 px-3 py-2 rounded-md">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default SideNav;
