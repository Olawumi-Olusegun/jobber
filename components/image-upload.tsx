"use client";

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { ImagePlus, Loader2, Trash } from 'lucide-react';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string;
}

const ImageUpload = ({disabled, onChange, onRemove, value}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleOnUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files || event.target.files.length === 0) return;

        const file: File = event.target.files[0];
        setIsLoading(true)
        const metadata = {contentType: file.type}
        const storageRef = ref(storage);
        const fileRef = ref(storageRef, `JobCoverImage/${Date.now()}-${file.name}`)

        const uploadTask = uploadBytesResumable(fileRef, file, metadata);

        uploadTask.on(("state_changed") , 
        (snapshot) => {
            setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        }, 
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                  toast.error("No user permission")
                  break;
                case 'storage/canceled':
                  toast.error("User canceled the upload")
                  break;

                case 'storage/unknown':
                  toast.error("Unknown error occurred")
                  break;

                  default: {
                    console.log(error)
                    toast.error(error?.message)
                    return;
                  }
              } 
 
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
                onChange(downloadURL)
                setIsLoading(false)
                toast.success("Image uploaded")
            }).catch((error) => {
                toast.success(error?.message)
            })
        });

    }

    const handleDeleteImage = () => {
        setIsDeleting(true)
        deleteObject(ref(storage, value))
        .then(() => {
            toast.success("Image deleted")
            onRemove(value)
        }).catch((error) => {
            if(error.code == "storage/object-not-found") {
                return toast.success("Image not found")
            }
            toast.success(error?.message)
        }).finally(() => {
            setIsDeleting(false)
        })
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null;
    }


  return (
    <div>
        {value 
        ? <div className='w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden'>
            <Image src={value} alt='Cover Image' fill sizes="100%" className='object-cover ' />
            <Button 
            type='button' 
            size={"icon"}
            disabled={disabled}
            variant={"destructive"}
            onClick={handleDeleteImage}
            className='absolute z-10 top-2 right-2 w-8 h-8 disabled:cursor-pointer'>
                 { isDeleting ? <Loader2  size={18} className='animate-spin' /> : <Trash size={18} />}
            </Button>
        </div> 
        : <div className='w-full h-60 border border-dashed bg-neutral-50 aspect-video relative rounded-md flex items-center justify-center overflow-hidden'>
            { isLoading 
            ? <>
                <p className=''>{`${progress.toFixed()}%`}</p>
            </> 
            : <>
                <label htmlFor='job-image'>
                    <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
                        <ImagePlus className='w-10 h-10' />
                        <p>Upload an image</p>
                    </div>
                    <input onChange={handleOnUploadImage} id='job-image' type='file' accept='image/*' className='h-0 w-0 hidden' />
                </label>
            </> 
            }
        </div>
        }
    </div>
  )
}

export default ImageUpload