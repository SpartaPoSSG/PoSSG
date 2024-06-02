import React, { useState } from 'react';
import { MdEdit,MdDelete, MdPhoto } from "react-icons/md";
import { CustomFlowbiteTheme, TextInput, Button, Modal } from 'flowbite-react';
import { manageFolder ,uploadThumbnail} from '../api/possgAxios';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedFolderState } from '../atom';
import { HiOutlineExclamationCircle } from "react-icons/hi";

function ProjectFolder(props: {
    sector: string; title: string; src: string;
}) {
    const navigate = useNavigate(); 
    const token = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);
    const [titleInput, setTitleInput] = useState<string>(props.title);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string>(props.src);
    const [folderInfo, setFolderInfo] = useRecoilState(selectedFolderState);
    const [openModal, setOpenModal] = useState(false);

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
            const folderResult = await manageFolder(token, {sector: props.sector, title: props.title, new_title: titleInput, is_Exist: 1});
        }

        setEditMode(false); // 수정 모드 종료
    };

    const handleDeleteFolder = async () => {
        // 폴더 삭제
        if (token) {
            const folderResult = await manageFolder(token, {sector: props.sector, title: titleInput, new_title: "", is_Exist: 2});
            setOpenModal(false);
        }
    };

    //서버에 올리는 용도(썸네일)
    const handleUploadPhoto = async (file: File) => {
        if (token) {
            const formData = new FormData();
            formData.append('sector', props.sector);
            formData.append('folderName', titleInput);
            formData.append('file', file);
            

            console.log('Sending form data:', {
                sector: props.sector,
                folderName: titleInput,
                file: file.name
            });

            try {
                const response = await uploadThumbnail(token, formData);
                console.log('Response from server:', response);
                if (response?.data.message === 'Upload success') {
                    setPreviewSrc(URL.createObjectURL(file));
                }
            } catch (error) {
                console.error('Error uploading thumbnail:', error);
            }
        }
    };

    //파일 선택하고 업로드 (프론트앤드 쪽)
    const handleFileUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setSelectedFile(file);
                setPreviewSrc(URL.createObjectURL(file));

                await handleUploadPhoto(file); // handleUploadPhoto 호출
            }
        };
        fileInput.click();
    };

    const handleFolderClick = () => {
        const folderInfo = {
            sector: props.sector,
            title: titleInput,
            src: props.src
        };
        setFolderInfo(folderInfo);
        navigate(`/project-detail/${props.sector}/${titleInput}`);
    };

    
    return (
        <>
        <div className='flex flex-1 bg-white rounded-lg ml-1 mr-1 shadow-inner outline outline-1 outline-neutral-200 hover:outline-blue-500/50'>
            <figure className='relative w-full h-full flex flex-col'>
            <div className="relative">
                <img className='h-48 rounded-lg rounded-b-none cursor-pointer object-cover w-full' src={previewSrc} alt="Project Folder" onClick={handleFolderClick}/>
                <div className="absolute top-2 right-2 flex">
                    {/* <MdDelete className="text-white bg-black/50 rounded-full p-1 cursor-pointer text-xl" onClick={handleDeleteFolder} /> */}
                    <MdDelete className="text-white bg-black/50 rounded-full p-1 cursor-pointer text-xl" onClick={() => setOpenModal(true)} />
                    <MdPhoto className="text-white bg-black/50 rounded-full p-1 ml-2 cursor-pointer text-xl" onClick={handleFileUpload} />
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
            
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <div className='fixed inset-0 z-40 bg-black opacity-50'></div>
                {/* <div className='flex items-center justify-center h-screen'>
                    <div className='bg-white rounded-lg shadow-lg p-6 w-100'> */}
                    <div className='flex items-center justify-center fixed inset-0 z-50  opacity-100'>
                        <div className='bg-white rounded-lg border-solid  border-black-500 p-70 flex flex-col justify-center items-center'>
                        {/* <Modal.Header /> */}
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-black-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 shadow-3xl">
                                    Are you sure you want to delete this folder?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button className="bg-red-500 text-black" onClick={handleDeleteFolder}>
                                        Yes, I'm sure
                                    </Button>
                                    <Button color="gray" onClick={() => setOpenModal(false)}>
                                        No, cancel
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </div>
                    </div>
                {/* </div> */}
            </Modal>

        </>

    );
}

export default ProjectFolder;