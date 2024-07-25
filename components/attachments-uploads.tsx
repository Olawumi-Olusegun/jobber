"use client";

import Image from 'next/image';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { File, FilePlus, X } from 'lucide-react';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface Image {
    url: string;
    name: string;
}

interface AttachmentsUploadProps {
    disabled?: boolean;
    onChange: (value: Image[]) => void;
    onRemove: (value: string) => void;
    value: Image[];
}

const AttachmentsUpload = ({disabled, onChange, onRemove, value}: AttachmentsUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleOnUploadAttachments = (event: ChangeEvent<HTMLInputElement>) => {
        
        if(!event.target.files || event.target.files.length === 0) return;

        const files: File[] = Array.from(event.target.files || []);
        setIsLoading(true)
        
        const newUrls: Image[] = [];

        let completedFiles = 0;

        files.forEach((file: File) => {

            const metadata = {contentType: file.type}
            const storageRef = ref(storage);
            const fileRef = ref(storageRef, `attachments/${Date.now()}-${file.name}`)
    
            const uploadTask = uploadBytesResumable(fileRef, file, metadata);
    
            uploadTask.on(("state_changed"),
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

                    newUrls.push({url: downloadURL, name: file.name})
                    completedFiles++;
                    
                    if(completedFiles === files.length) {
                        setIsLoading(false)
                        onChange([ ...value, ...newUrls ])
                        toast.success("Image uploaded")
                    }

                }).catch((error) => {
                    toast.success(error?.message)
                })
            });
        })

    }

    const handleDeleteImage = (item: Image) => {
        setIsDeleting(true)
        const newValue = value.filter(data => data.name !==  item.name);
        onChange(newValue);
        deleteObject(ref(storage, item.url))
        .then(() => {
            toast.success("File deleted")
            onRemove(item.url)
        }).catch((error: any) => {
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
        <div className="w-full p-2 flex items-center justify-end">
            { isLoading
            ? <p className=''>{`${progress.toFixed()}%`}</p>
            : <>
            <label htmlFor='attachment-image'>
                <div className="w-full h-full flex gap-2 p-2 rounded-md text-white bg-purple-500 hover:bg-purple-700 duration-300 items-center justify-center cursor-pointer">
                    <FilePlus className='w-5 h-5 ' />
                    <p>Add an file</p>
                </div>
                <input
                onChange={handleOnUploadAttachments}
                id='attachment-image'
                type='file'
                multiple
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
                className='h-0 w-0 hidden' 
                />
            </label>
            
            </>
            }
        </div>
        <div className="flex flex-col">
            {
                value && value.length > 0
                        ? <>
                           <div className="space-y-2">
                            {value.map((item) => (
                                <div key={item.url} className="relative flex items-center p-3 w-full rounded-md bg-purple-100 border-purple-200 border text-purple-700">
                                    <File className='w-4 h-4 mr-2' />
                                    <p  className="text-xs w-full truncate">{item.name}</p>
                                    <Button disabled={isDeleting || disabled} onClick={() => handleDeleteImage(item)} type='button' variant={"ghost"} size={"icon"} className='disabled:cursor-not-allowed h-8 w-8'>
                                        <X className='h-4 w-4' />
                                    </Button>
                                </div>
                            ))}
                           </div>
                        </>
                        : <p className='italic text-neutral-500'>No attachment</p>
            }
        </div>
    </div>
  )
}

export default AttachmentsUpload