import React, { useState } from 'react';
import { MdEdit,MdDelete, MdPhoto } from "react-icons/md";
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';
import { manageFolder } from '../api/possgAxios';
import { useNavigate } from 'react-router-dom';

function ProjectFolder(props: {
    sector: string; text: string; src: string;
}) {
    const navigate = useNavigate(); 
    const token = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);
    const [titleInput, setTitleInput] = useState<string>(props.text);

    const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitleInput(e.target.value);
    };
    
    
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

    const handleFolderNameSubmit = async () => {
        // 폴더명 수정 후 백엔드에 수정된 내용 전달
        if (token) {
            const folderResult = await manageFolder(token, {sector: props.sector, title: titleInput, is_Exist: 1});
        }

        setEditMode(false); // 수정 모드 종료
    };

    const handleDeleteFolder = async () => {
        // 폴더 삭제
        if (token) {
            const folderResult = await manageFolder(token, {sector: props.sector, title: titleInput, is_Exist: 2});
        }
    };

    const handleUploadPhoto = () => {
        // 사진 업로드 로직 구현
    };

    const handleFolderClick = () => {
        navigate(`/project-detail/${titleInput}`);
    };

    return (
        <>
        <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50'>
            <figure className='relative w-full h-full flex flex-col'>
            <div className="relative">
                <img className='h-48 rounded-lg rounded-b-none cursor-pointer object-cover w-full' src={props.src} alt="Project Folder" onClick={handleFolderClick}/>
                <div className="absolute top-2 right-2 flex">
                    <MdDelete className="text-white bg-black/50 rounded-full p-1 cursor-pointer text-xl" onClick={handleDeleteFolder} />
                    <MdPhoto className="text-white bg-black/50 rounded-full p-1 ml-2 cursor-pointer text-xl" onClick={handleUploadPhoto} />
                </div>
            </div>
                <div className='pt-2 pb-2 pl-3 pr-3 flex items-center'>
                    <TextInput
                        name="title"
                        theme={titleInputTheme}
                        type="text"
                        id="title"
                        onChange={handleFolderNameChange}
                        value={titleInput}
                        placeholder="title"
                        disabled={!editMode}
                    />
                    <MdEdit
                        className={`absolute right-4 cursor-pointer ${
                        editMode ? "text-blue-700" : ""
                        }`}
                        onClick={() => {
                            handleFolderNameSubmit();
                            handleEditToggle();
                        }}
                    />
                </div>
            </figure>
        </div>
        </>
    );
}

export default ProjectFolder;