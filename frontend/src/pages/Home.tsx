import React, { useState, useEffect, FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { MySectors } from '../interfaces/Interfaces';
import { getMyFolder, manageFolder } from '../api/possgAxios';
import InputForm from '../components/InputForm';
import { Button ,Alert} from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiInformationCircle } from "react-icons/hi";


const Home = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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

    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        const updateContainerWidth = () => {
          const contentContainer = document.getElementById('content-container');
          if (contentContainer) {
                const width = contentContainer.offsetWidth;
                setContainerWidth(width);
            }
        };

        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);

        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    const handleMakeFolder = async (e: FormEvent, sector: string) => {
        e.preventDefault();
        const newFolderName = newFolderNames[sector];
        // 새로운 폴더 이름이 빈 문자열인 경우 에러 처리
        if (newFolderName.trim() === '') {
            setError('폴더 이름을 입력해주세요.');
            return;
        }

        // 해당 섹터의 폴더 목록 가져오기
        const sectorFolders = folders.find(item => item.name === sector)?.folders || [];

        // 이미 존재하는 폴더 이름인 경우 에러 처리
        if (sectorFolders.some(folder => folder.title === newFolderName)) {
            setError('이미 존재하는 폴더 이름입니다.');
            return;
        }
        if (newFolderName.trim() !== '') {
            setFolders(prevFolders => {
                return prevFolders.map(item => {
                    if (item.name === sector) {
                        setError(null);// 폴더가 성공적으로 생성되었으므로 에러 상태를 초기화하여 알림을 숨김
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

    function movePortfolioBtn(e: FormEvent): void {
        navigate('/portfolio');
    }

    return (
        <>
            <div className='comp_content flex w-screen justify-center self-stretch  '>
                <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
                    <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 '>
                    <div className='comp_content flex justify-center my-3 mb-0 w-screen'>
                        {error && (
                            // <Alert color="failure" icon={HiOutlineExclamationCircle} >
                            //     <span className="font-medium">Error: </span> {error}
                            // </Alert>
                            <Alert color="failure" icon={HiInformationCircle}>
                                <span className="font-medium">Info alert!</span> Change a few things up and try submitting again.
                            </Alert>
                        )}
                        </div>
                        {folders.map(({ name, folders }) => (
                            <div key={name} id="content-container" className='comp_summary mx-auto md:w-[80%]'>
                                <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                                    <p className='text-xl font-PretendardVariable font-semibold ml-3'>{name}</p>
                                    <InputForm
                                        value={newFolderNames[name]}
                                        onChange={(e) => setNewFolderNames(prevNames => ({ ...prevNames, [name]: e.target.value }))}
                                        onSubmit={(e) => handleMakeFolder(e, name)}
                                        placeholder="폴더 제목을 입력하세요"
                                    />
                                </div>
                                {folders.length === 0 ? (
                                    <div className="bg-gray-50 border border-gray-200 text-xs font-PretendardVariable font-normal rounded-md mt-3 px-3 py-5 mx-3 text-center">폴더가 없습니다.</div>
                                ) : (
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-5'>
                                        {folders.map((folder, index) => (
                                            <div key={index} className='flex flex-col w-full p-2'>
                                                <ProjectFolder
                                                    sector={name}
                                                    src={folder.src}
                                                    title={folder.title}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Button
                color="dark" pill
                className="fixed cursor-auto bottom-0 left-1/2 transform -translate-x-1/2 mb-3 py-1 font-bold bg-black rounded-lg shadow-3xl"
                style={{ width: containerWidth }}
            >
                <img
                    alt="rocket"
                    className="mr-3 h-6 sm:h-9"
                    src="/img/rocket-3d-icon3.png"
                />
                <p className='text-xl pt-1'>클릭 한 번으로 <span className='text-emerald-200'>나만의 포트폴리오</span>를 만들어요!</p>
                <Button
                    className='tracking-tighter border-none ml-32 font-bold px-3 bg-blue-600 hover:bg-blue-700'
                    onClick={movePortfolioBtn}
                >
                    <p className='text-base'>지금 만들어보기</p>
                </Button>
            </Button>
        </>
    );
};

export default Home;