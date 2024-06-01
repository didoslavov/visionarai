import Image from 'next/image';
import React from 'react';
import huggingface from '/public/huggingface.jpg';
import Link from 'next/link';

const page = () => {
    return (
        <section className="text-teal-950 text-center mt-20 md:max-w-3xl md:mx-auto">
            <h1 className="text-3xl font-bold mb-8">Welcome to Visionarai</h1>
            <p className="text-lg text-teal-800">This is a playground for experimenting with HuggingFace and Transformers.js.</p>
            <Link href="https://huggingface.co" target="_blank">
                <Image src={huggingface} alt="hero" width={800} height={500} className="rounded-xl mt-20" />
            </Link>
        </section>
    );
};

export default page;
