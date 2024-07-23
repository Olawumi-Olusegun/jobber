"use client";

import React, { useEffect, useMemo, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

const Editor = ({onChange, value}: EditorProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ReactQill = useMemo(() => dynamic(() => import("react-quill"), {ssr: false}), []);
    
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if(!isLoaded) return null;

  return (
    <div className='bg-white'>
        <ReactQill onChange={onChange} value={value} theme='snow' />
    </div>
  )
}

export default Editor