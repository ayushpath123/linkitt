"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import img1 from '@/assets/homepages/img1.png';
import img2 from '@/assets/homepages/img2.png';
import img3 from '@/assets/homepages/img3.png';
import img4 from '@/assets/homepages/img4.png';
import img5 from '@/assets/homepages/img5.png';
import img from '@/assets/homepages/img.jpg'
function PrevHome() {
    const images = [img];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center mt-32">
            <div className="relative mb-4 w-full max-w-md">
                <Image 
                    src={images[currentImageIndex]} 
                    alt="Current" 
                    layout="responsive" // Make the image responsive
                    width={488}
                    height={476}
                    className="object-cover rounded-lg transition-opacity duration-300" 
                />
            </div>
        </div>
    );
}

export default PrevHome;
