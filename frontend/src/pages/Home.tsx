import React, { useState, FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { Folder } from '../interfaces/Interfaces';
import { editState } from '../atom'; // 새로 추가된 import 문
import { useNavigate } from 'react-router-dom';



const Home = () => {
    const navigate = useNavigate(); 
    const [folders, setFolders] = useState<{ [key: string]: string[] }>({
        '대외활동': [],
        '공모전': [],
        '동아리': [],
        '교내활동': []
    });

    const [newFolderNames, setNewFolderNames] = useState<{ [key: string]: string }> ({
        '대외활동': '',
        '공모전': '',
        '동아리': '',
        '교내활동': ''
    });

    const [selectedFolder, setSelectedFolder] = useState<string | null>(null); // 선택된 폴더명 상태 추가

    const handleMakeFolder = async (e: FormEvent, sector: string) => {
        e.preventDefault();
        const newFolderName = newFolderNames[sector];
        if (newFolderName.trim() !== '') {
            const newFolders = { ...folders };
            newFolders[sector] = [...folders[sector], newFolderName];
            setFolders(newFolders);
            setNewFolderNames({...newFolderNames, [sector]: ''});
            // 여기서 백엔드로 폴더 생성 요청을 보낼 수 있습니다.
            // 예: fetch('/api/createFolder', { method: 'POST', body: JSON.stringify({ sector, folderName: newFolderName }) })
        }
    };

    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>, sector: string) => {
        setNewFolderNames({ ...newFolderNames, [sector]: e.target.value });
    };

    const handleTitleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, sector: string) => {
        if (e.key === 'Enter') {
            // 엔터를 누르면 제목을 가지고 폴더를 생성하는 로직을 수행합니다.
            handleMakeFolder(e, sector);
        }
    };

    const handleFolderClick = (folderName: string) => {
        setSelectedFolder(folderName);
        navigate(`/project-detail/${folderName}`);
      };

    return (
        <>
            <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700'>
                <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                    <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                        {/* 대외활동 Section */}
                        <div className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-semibold ml-3'>대외활동</p>
                                <form onSubmit={(e) => handleMakeFolder(e, '대외활동')}>
                                    <input
                                        type="text"
                                        value={newFolderNames['대외활동']}
                                        onChange={(e) => handleTitleInputChange(e, '대외활동')}
                                        onKeyDown={(e) => handleTitleInputKeyPress(e, '대외활동')}
                                        placeholder="폴더 제목을 입력하세요"
                                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mr-3"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                                        폴더생성
                                    </button>
                                </form>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                {folders['대외활동'].map((folder, index) => (
                                    <div key={index} className='flex flex-col w-full p-2'>
                                        <ProjectFolder
                                            src={'img/example-img.png'}
                                            text={folder}
                                            onClick={() => handleFolderClick(folder)} // 클릭 이벤트 핸들러 추가
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* 공모전 Section */}
                        <div className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-semibold ml-3'>공모전</p>
                                <form onSubmit={(e) => handleMakeFolder(e, '공모전')}>
                                    <input
                                        type="text"
                                        value={newFolderNames['공모전']}
                                        onChange={(e) => handleTitleInputChange(e, '공모전')}
                                        onKeyDown={(e) => handleTitleInputKeyPress(e, '공모전')}
                                        placeholder="폴더 제목을 입력하세요"
                                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mr-3"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                                        폴더생성
                                    </button>
                                </form>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                {folders['공모전'].map((folder, index) => (
                                    <div key={index} className='flex flex-col w-full p-2'>
                                        <ProjectFolder
                                            src={'img/example-img.png'}
                                            text={folder}
                                            onClick={() => handleFolderClick(folder)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 동아리 Section */}
                        <div className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-semibold ml-3'>동아리</p>
                                <form onSubmit={(e) => handleMakeFolder(e, '동아리')}>
                                    <input
                                        type="text"
                                        value={newFolderNames['동아리']}
                                        onChange={(e) => handleTitleInputChange(e, '동아리')}
                                        onKeyDown={(e) => handleTitleInputKeyPress(e, '동아리')}
                                        placeholder="폴더 제목을 입력하세요"
                                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mr-3"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                                        폴더생성
                                    </button>
                                </form>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                {folders['동아리'].map((folder, index) => (
                                    <div key={index} className='flex flex-col w-full p-2'>
                                        <ProjectFolder
                                            src={'img/example-img.png'}
                                            text={folder}
                                            onClick={() => handleFolderClick(folder)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 교내활동 Section */}
                        <div className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-semibold ml-3'>교내활동</p>
                                <form onSubmit={(e) => handleMakeFolder(e, '교내활동')}>
                                    <input
                                        type="text"
                                        value={newFolderNames['교내활동']}
                                        onChange={(e) => handleTitleInputChange(e, '교내활동')}
                                        onKeyDown={(e) => handleTitleInputKeyPress(e, '교내활동')}
                                        placeholder="폴더 제목을 입력하세요"
                                        className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mr-3"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer">
                                        폴더생성
                                    </button>
                                </form>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                {folders['교내활동'].map((folder, index) => (
                                    <div key={index} className='flex flex-col w-full p-2'>
                                        <ProjectFolder
                                            src={'img/example-img.png'}
                                            text={folder}
                                            onClick={() => handleFolderClick(folder)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
