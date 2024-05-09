import React, { useState } from 'react';
import { MdEdit,MdDelete, MdPhoto } from "react-icons/md";
import { useRecoilState } from 'recoil';
import { editState } from '../atom';
import { CustomFlowbiteTheme, TextInput } from 'flowbite-react';

function ProjectFolder(props: {
    text: string; src: string; onClick: () => void;
}) {

    //const [editMode, setEditMode] = useRecoilState(editState);
    const [editMode, setEditMode] = useState(false); // 폴더별로 수정 모드를 관리하는 상태

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

    const handleFolderNameSubmit = () => {
        // 폴더명 수정 후 백엔드에 수정된 내용 전달하는 로직 추가
        // 수정된 내용은 is_Exist 1 번으로 설정해서 전달해야 함
        // fetch('/api/updateFolderName', {
        //     method: 'POST',
        //     body: JSON.stringify({ folderName, is_Exist: 1 }), // 수정된 내용과 is_Exist 값을 전달
        // });
        setEditMode(false); // 수정 모드 종료
    };

    const handleDeleteFolder = () => {
        // 폴더 삭제 로직 구현
    };

    const handleUploadPhoto = () => {
        // 사진 업로드 로직 구현
    };

    return (
        <>
        <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50' onClick={props.onClick}>
            <figure className='relative w-full h-full flex flex-col'>
            <div className="relative">
                <img className='h-48 rounded-lg rounded-b-none object-cover w-full' src={props.src} alt="Project Folder" />
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
                        //onClick={handleEditToggle}
                        onClick={() => {
                            if (editMode) {
                                handleFolderNameSubmit(); // 수정 완료 버튼 클릭 시 수정 내용을 부모 컴포넌트로 전달
                            } else {
                                handleEditToggle(); // 수정 모드 토글
                            }
                        }}
                    />
                </div>
            </figure>
        </div>
        </>
    );
}

export default ProjectFolder;