import React, { useState, FormEvent } from 'react';
import ProjectFolder from '../components/ProjectFolder';
import { Folder } from '../interfaces/Interfaces';


const Home = () => {
    const [folders, setFolders] = useState<string[]>([]);
    const [newFolderName, setNewFolderName] = useState<string>('');

    const handleMakeFolder = async (e: FormEvent) => {
    };

    const handleGetFolder = async (e: FormEvent) => {
    };

    return (
      <>
      <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary mx-auto md:w-[80%]'>
                  <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                      <p className='text-xl font-semibold ml-3'>대외활동</p>
                      <button
                          className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                          onClick={handleMakeFolder}>폴더생성
                      </button>
                  </div>
                  <div className='flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none pt-5'>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='신한카드 홍보대사'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='대우건설 홍보대사'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='대외활동123'
                      />
                    </div>
                  </div>
                </div>
                {/* 다음 section */}
                <div className='comp_summary mx-auto md:w-[80%]'>
                  <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                      <p className='text-xl font-semibold ml-3'>동아리</p>
                      <button
                          className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                          onClick={handleMakeFolder}>폴더생성
                      </button>
                  </div>
                  <div className='flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none pt-5'>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='멋쟁이 사자처럼 11기'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='멋쟁이 호랑이처럼'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='멋쟁이 하마처럼'
                      />
                    </div>
                  </div>
                </div>
                {/* 다음 section */}
                <div className='comp_summary mx-auto md:w-[80%]'>
                  <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                      <p className='text-xl font-semibold ml-3'>프로젝트</p>
                      <button
                          className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                          onClick={handleMakeFolder}>폴더생성
                      </button>
                  </div>
                  <div className='flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none pt-5'>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='메디컬 해커톤'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='졸업프로젝트'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='멋사 중앙해커톤'
                      />
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
      </>
    );
  };
  
export default Home;