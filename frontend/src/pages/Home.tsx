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
                  <div className='flex justify-between items-center pt-10 pb-2 border-b border-gray-500'>
                      <p className='text-xl font-semibold ml-3'>프로젝트</p>
                      <button
                          className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                          onClick={handleMakeFolder}>폴더생성
                      </button>
                  </div>
                  <div className='flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none pt-5'>

                    {/* <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='project1'
                      />
                    </div>
                    <div className='flex-col flex-1'>
                      <ProjectFolder
                        src={'img/example-img.png'}
                        text='project2'
                      />
                    </div> */}
                  </div>
                </div>
            </div>
        </div>
      </div>
      </>
    );
  };
  
export default Home;