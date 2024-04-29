import React, { useState } from 'react';
import { MdEdit } from "react-icons/md";
import { useRecoilState } from 'recoil';
import { editState } from '../atom';
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';

function ProjectFolder(props: {
    text: string; src: string; 
}) {

    const [editMode, setEditMode] = useRecoilState(editState);
    const [titleInput, setTitleInput] = useState<string>(props.text);
    
    const titleInputTheme: CustomFlowbiteTheme["textInput"] = {
        field: {
          input: {
            colors: {
              gray: "border-none text-gray-900",
            },
          },
        },
      };
    
    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    return (
        <>
        <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50'>
            <figure className='relative w-full h-full flex flex-col'>
                <img
                    className='h-48 rounded-lg rounded-b-none object-fit'
                    src={props.src}
                />
                <div className='pt-2 pb-2 pl-3 pr-3 flex items-center'>
                    <TextInput
                        name="title"
                        theme={titleInputTheme}
                        type="text"
                        id="title"
                        onChange={(e) => setTitleInput(e.target.value)}
                        value={titleInput}
                        placeholder="title"
                        disabled={!editMode}
                    />
                    <MdEdit
                        className={`absolute right-4 cursor-pointer ${
                        editMode ? "text-blue-700" : ""
                        }`}
                        onClick={handleEditToggle}
                    />
                </div>
            </figure>
        </div>
        </>
    );
}

export default ProjectFolder;