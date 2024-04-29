import React from 'react';

function ProjectFolder(props: {
    text: string; src: string; 
}) {
    return (
        <>
        <div className='flex flex-1 rounded-lg'>
            <figure className='relative w-full h-52 flex flex-col'>
                <img
                    className='block w-full max-w-max h-full object-cover'
                    src={props.src}
                />
                <div className='pt-2 pl-2 pr-7 flex-grow'>
                    <h5 className='font-PretendardVariable text-m leading-6'>{props.text}</h5>
                </div>
            </figure>
        </div>
        </>
    );
}

export default ProjectFolder;