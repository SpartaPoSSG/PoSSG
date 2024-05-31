import React, { useState, useEffect, FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { MySectors } from '../interfaces/Interfaces';
import { getMyFolder, manageFolder } from '../api/possgAxios';
import InputForm from '../components/InputForm';


const Home = () => {
    const token = localStorage.getItem('token');

    const [folders, setFolders] = useState<MySectors>([
        { name: '대외활동', folders: [] },
        { name: '공모전', folders: [] },
        { name: '동아리', folders: [] },
        { name: '교내활동', folders: [] }
    ]);

    const [newFolderNames, setNewFolderNames] = useState<{ [key: string]: string }> ({
        '대외활동': '',
        '공모전': '',
        '동아리': '',
        '교내활동': ''
    });

    const fetchFolders = async () => {
        if (token) {
            const folderResponse = await getMyFolder(token);
            if (folderResponse && folderResponse.data) {
                console.log(folderResponse.data);
    
                // 'folders' 키를 사용하여 배열을 추출
                const foldersArray = folderResponse.data.folders;
                console.log("Extracted foldersArray:", foldersArray);
    
                if (Array.isArray(foldersArray)) {
                    const updatedFolders = folders.map(sector => {
                        const sectorFolders = foldersArray
                            .filter(folder => folder.name === sector.name)
                            .flatMap(folder => folder.folders);  // 중첩 배열을 단일 배열로 변환
                        return { ...sector, folders: sectorFolders };
                    });
    
                    setFolders(updatedFolders);
                } else {
                    console.error('foldersArray is not an array:', foldersArray);
                }
            }
        }
    };
    
    useEffect(() => {
        fetchFolders();
    }, [token]);

    const handleMakeFolder = async (e: FormEvent, sector: string) => {
        e.preventDefault();
        const newFolderName = newFolderNames[sector];
        if (newFolderName.trim() !== '') {
            setFolders(prevFolders => {
                return prevFolders.map(item => {
                    if (item.name === sector) {
                        if (sector == '대외활동') {
                            return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/thumbnails_skyblue.png' }] };
                        } else if (sector == '공모전') {
                            return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/thumbnails_green.png' }] };
                        } else if (sector == '동아리') {
                            return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/thumbnails_purple.png' }] };
                        } else {
                            return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/thumbnails_pink.png' }] };
                        }
                        
                    }
                    return item;
                });
            });

            setNewFolderNames(prevNames => ({ ...prevNames, [sector]: '' }));

            if (token) {
                await manageFolder(token, { sector: sector, title: newFolderName, new_title: "", is_Exist: 0 });
            }
        }
    };

    const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>, sector: string) => {
        setNewFolderNames({ ...newFolderNames, [sector]: e.target.value });
    };

    const handleTitleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, sector: string) => {
        if (e.key === 'Enter') {
            handleMakeFolder(e, sector);
        }
    };


    return (
        <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700'>
            <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                    {folders.map(({ name, folders }) => (
                        <div key={name} className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-PretendardVariable font-semibold ml-3'>{name}</p>
                                <InputForm
                                    value={newFolderNames[name]}
                                    onChange={(e) => setNewFolderNames(prevNames => ({ ...prevNames, [name]: e.target.value }))}
                                    onSubmit={(e) => handleMakeFolder(e, name)}
                                    placeholder="폴더 제목을 입력하세요"
                                />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                {folders.length === 0 ? (
                                    <div className="text-center">폴더가 없습니다.</div>
                                ) : (
                                    folders.map((folder, index) => (
                                        <div key={index} className='flex flex-col w-full p-2'>
                                            <ProjectFolder
                                                sector={name}
                                                src={folder.src}
                                                title={folder.title}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;