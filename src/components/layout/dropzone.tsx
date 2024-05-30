'use client';

import { type SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { type FileError, type FileRejection, useDropzone } from 'react-dropzone';
import type { TransformerData } from '@/app/object-detection/page';
import Image from 'next/image';
import Frame from '../ui/image-frame';
import { IoMdClose } from 'react-icons/io';
import { cn } from '@/lib/utils';

type DropzoneProps = {
    status: string;
    setStatus: Function;
    detector: Function;
    result: TransformerData[] | null;
    setResult: Function;
    className: string;
};

type FileWithPreview = File & { preview?: string };

const Dropzone = ({ status, className, detector, result, setResult, setStatus }: DropzoneProps) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [rejected, setRejected] = useState<FileRejection[]>([]);

    const imageRef = useRef<HTMLImageElement>(null);
    const [scaleFactors, setScaleFactors] = useState({ scaleX: 1, scaleY: 1 });

    const onDrop = useCallback(
        (accepted: FileWithPreview[], rejected: FileRejection[]) => {
            if (accepted.length) {
                setFiles(accepted.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })));

                setStatus('ready');
                setResult(null);

                const reader = new FileReader();
                reader.onload = function (e) {
                    const image = e?.target?.result;
                    detector(image);
                };
                reader.readAsDataURL(accepted[0]);
            }

            if (rejected.length) {
                setRejected(rejected);
            }
        },
        [detector, setResult, setStatus]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': [],
        },
        maxSize: 1024 * 1000,
        maxFiles: 1,
        onDrop,
    });

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview || ''));
    }, [files]);

    const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const img = event.currentTarget;
        if (imageRef.current) {
            const originalWidth = img.naturalWidth;
            const originalHeight = img.naturalHeight;
            const displayedWidth = imageRef.current.clientWidth;
            const displayedHeight = imageRef.current.clientHeight;
            setScaleFactors({
                scaleX: displayedWidth / originalWidth,
                scaleY: displayedHeight / originalHeight,
            });
        }
    };

    const deleteImage = () => {
        setFiles([]);
        setRejected([]);
    };

    return (
        <>
            <div
                {...getRootProps({
                    className: className,
                })}>
                <input {...getInputProps({ name: 'file' })} />
                <div className="flex flex-col items-center justify-center gap-4 text-teal-950">
                    {isDragActive ? <p>Drop the image here</p> : <p>Drag & drop image here, or click to select</p>}
                    <div className="flex flex-col items-center justify-center text-xs text-teal-950/50">
                        <p> Max uploads: 1 image</p>
                        <p> Max image size: 1024 * 1000</p>
                    </div>
                </div>
            </div>
            <section className="mt-6">
                {files.length > 0 && (
                    <div className="relative h-[500px] rounded-xl shadow-lg">
                        <Image
                            width={100}
                            height={100}
                            ref={imageRef}
                            src={files[0].preview || ''}
                            alt={files[0].name}
                            onLoad={handleImageLoad}
                            className={cn(
                                'h-full w-full rounded-xl overflow-hidden object-cover',
                                status !== 'complete' && 'animate-pulse'
                            )}
                        />
                        {result &&
                            result.map((object: TransformerData, index: number) => (
                                <Frame key={index} object={object} scaleX={scaleFactors.scaleX} scaleY={scaleFactors.scaleY} />
                            ))}
                        <button
                            type="button"
                            className="absolute -right-3 -top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-rose-500 bg-rose-500 text-lime-50 transition-colors hover:bg-lime-50 hover:text-rose-500"
                            onClick={() => deleteImage()}>
                            <IoMdClose className="text-xl" />
                        </button>
                        {status !== 'complete' && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-teal-800/70 text-xl font-semibold text-lime-50">
                                Detecting Objects...
                            </div>
                        )}
                    </div>
                )}
                {rejected.length > 0 && (
                    <div>
                        <h3 className="title mt-24 border-b pb-3 text-xl font-semibold text-teal-950">Rejected Files</h3>
                        <ul className="mt-6 flex flex-col">
                            {rejected.map(({ file, errors }) => (
                                <li key={file.name} className="flex items-start justify-between">
                                    <div>
                                        <p className="mt-2 text-sm font-medium text-teal-950">{file.name}</p>
                                        <ul className="text-[12px] text-rose-500">
                                            {errors.map((error: FileError) => (
                                                <li key={error.code}>{error.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-1 rounded-xl border border-rose-500 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-teal-950 transition-colors hover:bg-rose-500 hover:text-lime-50"
                                        onClick={() => deleteImage()}>
                                        remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </>
    );
};

export default Dropzone;
