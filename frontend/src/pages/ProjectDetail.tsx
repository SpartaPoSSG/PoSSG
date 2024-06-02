import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiUpload } from "react-icons/bi";
import Footer from '../components/Footer';
import ProjectPreview from '../components/ProjectPreview';
import { Document, Page, pdfjs } from "react-pdf";
import ProjectFile from '../components/ProjectFile';
import { getFolderPortfolio, getMyProjectFiles, uploadProjectFiles } from '../api/possgAxios';
import { useRecoilState } from 'recoil';
import { selectedFolderState } from '../atom';
import { Banner, Button, Dropdown, Spinner } from 'flowbite-react';
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiX } from 'react-icons/hi';
import { MdAnnouncement } from 'react-icons/md';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const ProjectDetail = () => {
  const { folderName } = useParams() as { folderName: string };
  const { sector } = useParams() as { sector: string };
  const [folderInfo, setFolderInfo] = useRecoilState(selectedFolderState);
  const [isActive, setActive] = useState<boolean>(false);
  const [isExist, setExist] = useState<boolean>(false);
  const [filePreviews, setFilePreviews] = useState<{ file: File; preview: string, name: string }[]>([]);
  const [fileFinals, setFileFinals] = useState<{ file: File; preview: string, name: string }[]>([]);
  const [folderPortfolio, setFolderPortfolio] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [isPortfolioExist, setPortfolioExist] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const popupRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');

  const folder = {
    sector: sector,
    title: folderName
  }

  const Logo = () => (
    <svg className="w-24 h-24 mt-32 pointer-events-none" x="0px" y="0px" viewBox="0 0 24 24">
      <path fill="transparent" d="M0,0h24v24H0V0z" />
      <path
        fill="#000"
        d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
      />
    </svg>
  );
  
  const handleDragStart = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragEnd = () => setActive(false);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setActive(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png'
    );
    uploadFiles(files);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const modifiedName = file.name.replace(/_/g, ' '); // _를 공백으로 대체
          setFilePreviews(prevFilePreviews => [...prevFilePreviews, { file, preview: e.target?.result as string, name: modifiedName }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePreviewDelete = (index: number) => {
    setFilePreviews(prevFilePreviews => prevFilePreviews.filter((_, i) => i !== index));
  };

  const handleUploadButtonClick = async () => {
    if (token) {
      const formData = new FormData();
      formData.append('sector', sector);
      formData.append('title', folderName);
      
      filePreviews.forEach(({ file }) => {
        formData.append('files', file);
      });

      const response = await uploadProjectFiles(token, formData);
      console.log(response?.data.message);

      setShowPopup(false);
      setActive(false);
      setExist(true);
      setFileFinals(prevFileFinals => [...prevFileFinals, ...filePreviews]);
      setFilePreviews([]);
    }
  };

  const handlePopUpButtonClick = () => {
    setShowPopup(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false);
      setFilePreviews([]);
    }
  };

  const handleSummaryButtonClick = async () => {
    setShowSummary(true);

    if (folderPortfolio) {
      setPortfolioExist(true);
    } else {
      setPortfolioExist(true);

      if (token) {
        const folderPortfolioResponse = await getFolderPortfolio(token, folder);

        if (folderPortfolioResponse && folderPortfolioResponse.data.summary) {
          setFolderPortfolio(folderPortfolioResponse.data.summary);
          setPortfolioExist(true);
        }
      }
    }
  }

  const fetchFiles = async () => {
    console.log(sector);
    if (token) {
        const successResponse = await getMyProjectFiles(token, folder);
        console.log(successResponse?.data);
        
        if (successResponse && successResponse.data) {
          if (successResponse.data.files.length > 0) {
            setExist(true);
          }

          if (successResponse.data.folder_portfolio) {
            setFolderPortfolio(successResponse.data.folder_portfolio);
            setShowSummary(true);
          }
          
          const files = successResponse.data.files.map(({ file, src }) => ({
              file: file,
              preview: src,
              name: file.toString().split('/').pop()?.replace(/_/g, ' ') as string
          }));
          setFileFinals(files);
        }
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

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
    // 팝업창 닫기 이벤트
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  

  return (
    <>
      <div className='flex w-screen justify-center self-stretch bg-white text-gray-700'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
              <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div id="content-container" className='mx-auto md:w-[80%]'>
                  <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                    <p className='text-xl font-PretendardVariable font-semibold ml-3'>{sector}&nbsp;/&nbsp;{folderName}</p>
                    <div className='flex items-center'>
                        <Button
                          className='text-black border-slate-300 custom-gradient-hover from-gradient-start to-gradient-end h-8 font-semibold mr-3'
                          onClick={handleSummaryButtonClick}
                        >
                            <FaWandMagicSparkles />&nbsp;
                            <p className='text-xs'>요약</p>
                        </Button>
                        <button
                          type="submit"
                          className="bg-black text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 transition duration-200 ease-in-out cursor-pointer"
                          onClick={handlePopUpButtonClick}
                        >
                        파일 업로드
                        </button>
                    </div>
                  </div>
                  <div className='mt-3'>
                    {showSummary ? (
                      <>
                      {isPortfolioExist ? (
                        <>
                        <Dropdown 
                          label={<span className="text-black text-lg">내 폴더 요약 정보 확인하기!</span>} 
                          className='border-0 bg-blue-100'
                          style={{ width: containerWidth }}
                        >
                          <Dropdown.Header style={{ width: containerWidth }}>
                            <span className="block text-sm">{folderPortfolio}</span>
                          </Dropdown.Header>
                        </Dropdown>
                        </>
                      ) : (
                        <>
                        <Banner className='ml-3 mr-3'>
                          <div className="flex w-full flex-col justify-between bg-blue-100 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
                            <div className="mx-auto flex items-center">
                              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                                <MdAnnouncement className="mr-4 h-4 w-4" />
                                <span className="[&_p]:inline">
                                  폴더 정보를 요약하고 있어요! 조금만 기다려주세요!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <Spinner aria-label="Center-aligned spinner example bg-blue-600" />
                                </span>
                              </p>
                            </div>
                          </div>
                        </Banner>
                        </>
                      )}
                      </>
                    ) : (
                      <>
                      <Banner className='ml-3 mr-3'>
                        <div className="flex w-full flex-col justify-between bg-blue-100 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
                          <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
                            <div
                              className="mb-2 flex items-center border-gray-200 dark:border-gray-600 md:mb-0 md:mr-4 md:border-r md:pr-4"
                            >
                              <img src="/img/logo_black.png" className="ml-5 mr-3 h-6" alt="logo" />
                            </div>
                            <p className="flex items-center text-sm font-normal text-gray-800 dark:text-gray-400">
                              지금 업로드한 자료들에 대한 요약을 확인해보세요!
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center">
                            <Button onClick={handleSummaryButtonClick} className='bg-blue-500 font-semibold'>요약하기</Button>
                            <Banner.CollapseButton color="gray" className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
                              <HiX className="h-4 w-4" />
                            </Banner.CollapseButton>
                          </div>
                        </div>
                      </Banner>
                      </>
                    )}
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-2 ml-3 mr-3 mt-5 mb-5'>
                        {/* 자료 반환한 거 띄우는 위치 */}
                        {fileFinals.map((fileFinals, index) => (
                          <div key={index} className='flex flex-col w-full pb-1'>
                            <ProjectFile
                              file_name={fileFinals.file.name}
                              name={fileFinals.name}
                              src={fileFinals.preview}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  {!isExist && (
                    <div className='mt-3'>
                      <label
                        className={`bg-white rounded-lg outline-dashed outline-2 outline-gray-300 hover:outline-gray-500 p-70 flex flex-col justify-center items-center cursor-pointer${isActive ? ' bg-efeef3 border-111' : ''}`}
                        onDragEnter={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragEnd}
                        onDrop={handleDrop}
                      >
                        {filePreviews.length ? (
                          <>
                          <div className='grid grid-cols-1 md:grid-cols-5 gap-2 ml-3 mr-3 mt-5 mb-5'>
                            {filePreviews.map((filePreviews, index) => (
                              <div key={index} className='flex flex-col w-full pb-1'>
                                {filePreviews.file.type === 'application/pdf' && (
                                  <Document
                                    file={filePreviews.file}
                                    className={'hidden'}
                                    onLoadSuccess={(pdf) => {
                                      pdf.getPage(1).then((page) => {
                                        const viewport = page.getViewport({ scale: 1 });
                                        const canvas = document.createElement('canvas');
                                        const canvasContext = canvas.getContext('2d');
                                        if (canvasContext) {
                                          canvas.width = viewport.width;
                                          canvas.height = viewport.height;
                                          page.render({ canvasContext, viewport }).promise.then(() => {
                                            canvas.toBlob((blob) => {
                                              if (blob) {
                                                const imageUrl = URL.createObjectURL(blob);
                                                setFilePreviews(prevFilePreviews => {
                                                  const updatedPreviews = [...prevFilePreviews];
                                                  updatedPreviews[index].preview = imageUrl;
                                                  return updatedPreviews;
                                                });
                                              }
                                            });
                                          });
                                        }
                                      });
                                    }}
                                  >
                                    <Page pageNumber={1} />
                                  </Document>
                                )}
                                <ProjectPreview
                                  name={filePreviews.name}
                                  src={filePreviews.preview}
                                  onDelete={() => handlePreviewDelete(index)}
                                />
                              </div>
                            ))}
                          </div>
                          </>
                        ) : (
                          <>
                            <Logo />
                            <p className="font-medium font-PretendardVariable text-lg my-20 mb-10">클릭 혹은 여러 파일을 이곳에 드롭하세요!</p>
                            <p className="mb-32 font-PretendardVariable text-sm">파일당 최대 3MB</p>
                          </>
                        )}
                        <input type="file" className="file hidden" accept='.png, .jpeg, .pdf' onChange={handleUpload} multiple />
                      </label>
                      <button className={`w-full text-white text-xs font-PretendardVariable font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer ${filePreviews.length? 'bg-blue-600' : 'bg-black'}`} onClick={handleUploadButtonClick}>업로드 하기</button>
                    </div>
                  )}
                </div>
              </div>
          </div>
          {showPopup && (
            <>
              <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 flex items-center justify-center">
                {/* 모달 백그라운드 */}
              </div>
              <div ref={popupRef} className={`mx-auto h-3/7 bg-white rounded-lg border-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-4 z-1`} style={{ width: containerWidth }}>
                <div className='m-4'>
                  <label
                    className={`bg-white rounded-lg outline-dashed outline-2 outline-gray-300 hover:outline-gray-500 p-70 flex flex-col justify-center items-center cursor-pointer${isActive ? ' bg-efeef3 border-111' : ''}`}
                    onDragEnter={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragEnd}
                    onDrop={handleDrop}
                  >
                    {filePreviews.length ? (
                      <>
                      <div className='grid grid-cols-1 md:grid-cols-5 gap-2 ml-3 mr-3 mt-5 mb-5'>
                        {filePreviews.map((filePreviews, index) => (
                          <div key={index} className='flex flex-col w-full pb-1'>
                            {filePreviews.file.type === 'application/pdf' && (
                              <Document
                                file={filePreviews.file}
                                className={'hidden'}
                                onLoadSuccess={(pdf) => {
                                  pdf.getPage(1).then((page) => {
                                    const viewport = page.getViewport({ scale: 1 });
                                    const canvas = document.createElement('canvas');
                                    const canvasContext = canvas.getContext('2d');
                                    if (canvasContext) {
                                      canvas.width = viewport.width;
                                      canvas.height = viewport.height;
                                      page.render({ canvasContext, viewport }).promise.then(() => {
                                        canvas.toBlob((blob) => {
                                          if (blob) {
                                            const imageUrl = URL.createObjectURL(blob);
                                            setFilePreviews(prevFilePreviews => {
                                              const updatedPreviews = [...prevFilePreviews];
                                              updatedPreviews[index].preview = imageUrl;
                                              return updatedPreviews;
                                            });
                                          }
                                        });
                                      });
                                    }
                                  });
                                }}
                              >
                                <Page pageNumber={1} />
                              </Document>
                            )}
                            <ProjectPreview
                              name={filePreviews.name}
                              src={filePreviews.preview}
                              onDelete={() => handlePreviewDelete(index)}
                            />
                          </div>
                        ))}
                      </div>
                      </>
                    ) : (
                      <>
                        <Logo />
                        <p className="font-medium font-PretendardVariable text-lg my-20 mb-10">클릭 혹은 여러 파일을 이곳에 드롭하세요!</p>
                        <p className="mb-32 font-PretendardVariable text-sm">파일당 최대 3MB</p>
                      </>
                    )}
                    <input type="file" className="file hidden" accept='.png, .jpeg, .pdf' onChange={handleUpload} multiple />
                  </label>
                  <button className={`w-full text-white text-xs font-PretendardVariable font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer ${filePreviews.length? 'bg-blue-600' : 'bg-black'}`} onClick={handleUploadButtonClick}>업로드 하기</button>
                </div>
              </div>
            </>
          )}
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;
