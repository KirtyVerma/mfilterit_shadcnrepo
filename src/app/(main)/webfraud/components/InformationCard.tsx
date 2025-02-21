import React from 'react';
import { Card,
    CardContent,
    
    CardHeader,
    CardTitle,

 } from '@/components/ui/card';

 interface InformationCardProps{
    InformTitle?:string;
    informDescription?:string;
 }

export const InformationCard :React.FC<InformationCardProps>= ({
    InformTitle,
    informDescription
}) => {
  return (
    <>
    <Card className='shadow-md rounded-md  w-[150px] sm:w-[150px] md:w-[130px] lg:w-[150px] xl:w-[300px] h-20 mb-2 w-full'>
        <CardHeader className='p-1 bg-yellow-300'>
            <CardTitle className='text-[0.400rem] lg:text-[0.400rem] md:text-[0.400rem] xl:text-small-font sm:text-[0.400rem] font-semibold'>
                {InformTitle}
            </CardTitle>
        </CardHeader>
        <CardContent className='text-[0.400rem] sm:text-[0.400rem] lg:text-[0.400rem] xl:text-small-font md:text-[0.400rem] mt-0'>
            {informDescription}
        </CardContent>

    </Card>
    </>
  )
}
