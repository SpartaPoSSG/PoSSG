import React, { useState, useEffect, FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { useNavigate } from 'react-router-dom';
import { getMyFolder, manageFolder } from '../api/possgAxios';
import InputForm from '../components/InputForm';
import { findByTitle } from '@testing-library/react';
import { selectedSectorState} from '../../src/atom';
import { useRecoilState } from 'recoil';

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [folders, setFolders] = useState<{ sector: string, folders: { title: string, src: string }[] }[]>([
        { sector: '대외활동', folders: [] },
        { sector: '공모전', folders: [] },
        { sector: '동아리', folders: [] },
        { sector: '교내활동', folders: [] }
    ]);

    //const [folders, setFolders] = useState<{ title:String; src:String }[]>([]);
    const [newFolderNames, setNewFolderNames] = useState<{ [key: string]: string }>({
        '대외활동': '',
        '공모전': '',
        '동아리': '',
        '교내활동': ''
    });

    // const fetchFolders = async () => {
    //     if (token) {
    //         const folderResponse = await getMyFolder(token);
    //         if (folderResponse && folderResponse.data) {
    //             const fetchedFolders = folderResponse.data.folders;
    //             setFolders(prevFolders =>
    //                 prevFolders.map(item => ({
    //                     sector: item.sector,
    //                     folders: fetchedFolders
    //                         //.filter(folder => folder.sector === item.sector)
    //                         .map(folder => ({ title: folder.title, src: folder.src }))
    //                 }))
    //             );
    //         }
    //     }
    // };

    // useEffect(() => {
    //     fetchFolders();
    // }, [token]);

    //5/27 밤 잠깐 되었던(?) 코드
    // const fetchFolders = async () => {
    //     if (token) {
    //         const folderResponse = await getMyFolder(token);
    //         if (folderResponse && folderResponse.data) {
    //             setFolders(folderResponse.data);
    //         }
    //     }
    // };
    // useEffect(() => {
    //     fetchFolders();
    // }, [token]);

    const [sectorInfo2, setSectorInfo2] = useRecoilState(selectedSectorState);

    const fetchFolders = async () => {
        if (token) {
            const folderResponse = await getMyFolder(token);
            if (folderResponse && folderResponse.data) {
                //setFolders(folderResponse.data);
                console.log('Received folder data:', folderResponse.data);
                const files = folderResponse.data.folders.map(file => ({
                    title: file.title,
                    src: file.src,
                    //name: file.file.name.replace(/_/g, ' ')
                }
                //setFolders(files);
            ));
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
                    if (item.sector === sector) {
                        return { ...item, folders: [...item.folders, { title: newFolderName, src: 'img/example-img.png' }] };
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
                    {folders.map(({ sector, folders }) => (
                        <div key={sector} className='comp_summary mx-auto md:w-[80%]'>
                            <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                <p className='text-xl font-PretendardVariable font-semibold ml-3'>{sector}</p>
                                <InputForm
                                    value={newFolderNames[sector]}
                                    onChange={(e) => setNewFolderNames(prevNames => ({ ...prevNames, [sector]: e.target.value }))}
                                    onSubmit={(e) => handleMakeFolder(e, sector)}
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
                                                sector={sector}
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

