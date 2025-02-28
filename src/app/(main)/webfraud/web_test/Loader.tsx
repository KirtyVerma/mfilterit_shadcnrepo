import { Loader2 } from 'lucide-react';
import React from 'react';

const Loader = () => {
    return (
        <div className='h-full w-full flex justify-center items-center text-primary'>
            <Loader2 className='animate-spin h-8 w-8'/>
        </div>
    );
}

export default Loader;
