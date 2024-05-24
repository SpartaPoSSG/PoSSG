import React, { useState, useEffect,FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { Sector } from '../interfaces/Interfaces';
import { useNavigate } from 'react-router-dom';
import { getMyFolder, manageFolder } from '../api/possgAxios';
import InputForm from '../components/InputForm';



const Home = () => {
    const navigate = useNavigate(); 
    const token = localStorage.getItem('token');

    const [folders, setFolders] = useState<Sector[]>([
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

    const [selectedFolder, setSelectedFolder] = useState<string | null>(null); // 선택된 폴더명 상태 추가

    useEffect(() => {
        const fetchFolders = async () => {
            if (token) {
                const folderResponse = await getMyFolder(token);
                if (folderResponse && folderResponse.data) {
                    setFolders(folderResponse.data);
                }
            }
        };
        fetchFolders();
    }, [token]);

    const handleMakeFolder = async (e: FormEvent, sector: string) => {
        e.preventDefault();
        const newFolderName = newFolderNames[sector];
        if (newFolderName.trim() !== '') {
            // setFolders(prevFolders => {
            //     return prevFolders.map(item => {
            //         if (item.name === sector) {
            //             return { ...item, folders: [...item.folders, newFolderName] };
            //         }
            //         return item;
            //     });
            // });

            
            //sector에 썸네일 추가해서 바꿈
            setFolders(prevFolders => {
                return prevFolders.map(item => {
                    if (item.name === sector) {
                        return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/example-img.png' }] }; // src 값은 초기화해도 될 듯합니다.
                    }
                    return item;
                });
            });
            
            
            setNewFolderNames(prevNames => ({ ...prevNames, [sector]: '' }));

            // 폴더 생성
            if (token) {
                const folderResult = await manageFolder(token, {sector: sector, title: newFolderName, new_title: "" ,is_Exist: 0});
            }
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
                                    {folders.map((folder, index) => (
                                        <div key={index} className='flex flex-col w-full p-2'>
                                            <ProjectFolder
                                                sector={name}
                                                src={folder.src}
                                                text={folder.title}
                                                // onClick={() => handleFolderClick(folder)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;

