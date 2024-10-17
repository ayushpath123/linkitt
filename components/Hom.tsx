import React from 'react';
import Appbar from './Appbar';
import TextHome from './TextHome';
import PrevHome from './PrevHome';

function Hom() {
  return (
    <div className='bg-black min-h-screen'>
      <Appbar />
      <div className='grid sm:grid-cols-1 md:grid-cols-2'>
        <TextHome />
        <div className='hidden md:block'>
          <PrevHome />
        </div>
      </div>
    </div>
  );
}

export default Hom;
