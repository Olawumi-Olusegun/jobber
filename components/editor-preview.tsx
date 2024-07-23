"use client";

import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.bubble.css';
import dynamic from 'next/dynamic';

interface EditorPreviewProps {
    value: string;
}

const EditorPreview = ({value}: EditorPreviewProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ReactQill = useMemo(() => dynamic(() => import("react-quill"), {ssr: false}), []);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if(!isLoaded) return null;

  return (
    <div className='bg-white'>
        <ReactQill value={value} theme='bubble' />
    </div>
  )
}

export default EditorPreview