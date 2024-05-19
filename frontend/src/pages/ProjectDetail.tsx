import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiUpload } from "react-icons/bi";
import Footer from '../components/Footer';
import ProjectPreview from '../components/ProjectPreview';
import { Document, Page, pdfjs } from "react-pdf";
import ProjectFile from '../components/ProjectFile';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const ProjectDetail = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const { sector } = useParams<{ sector: string }>();
  const [isActive, setActive] = useState<boolean>(false);
  const [isExist, setExist] = useState<boolean>(false);
  const [filePreviews, setFilePreviews] = useState<{ file: File; preview: string, name: string }[]>([]);
  const [fileFinals, setFileFinals] = useState<{ file: File; preview: string, name: string }[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const Logo = () => (
    <svg className="w-24 h-24 mt-5 pointer-events-none" x="0px" y="0px" viewBox="0 0 24 24">
      <path fill="transparent" d="M0,0h24v24H0V0z" />
      <path
        fill="#000"
        d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
      />
    </svg>
  );

  const Logo2 = () => (
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

  const handleUploadButtonClick = () => {
    setShowPopup(false);

    if (filePreviews.length) {
      setActive(false);
      setExist(true);

      // filePreviews 배열에 있는 데이터를 fileFinals 배열에 추가하고 비우기
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
                      <button
                        type="submit"
                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                        onClick={handlePopUpButtonClick}
                      >
                        {"파일 업로드"}
                      </button>
                  </div>
                  <div className='mt-3'>
                    <div className='grid grid-cols-1 md:grid-cols-5 gap-2 ml-3 mr-3 mt-5 mb-5'>
                        {/* 자료 반환한 거 띄우는 위치 */}
                        {fileFinals.map((fileFinals, index) => (
                          <div key={index} className='flex flex-col w-full pb-1'>
                            <ProjectFile
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
                            <p className="mb-5 font-PretendardVariable text-sm">파일당 최대 3MB</p>
                          </>
                        )}
                        <input type="file" className="file hidden" accept='.png, .jpeg, .pdf' onChange={handleUpload} multiple />
                      </label>
                      <button className='w-full bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer' onClick={handleUploadButtonClick}>업로드 하기</button>
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
                        <Logo2 />
                        <p className="font-medium font-PretendardVariable text-lg my-20 mb-10">클릭 혹은 여러 파일을 이곳에 드롭하세요!</p>
                        <p className="mb-32 font-PretendardVariable text-sm">파일당 최대 3MB</p>
                      </>
                    )}
                    <input type="file" className="file hidden" accept='.png, .jpeg, .pdf' onChange={handleUpload} multiple />
                  </label>
                  <button className='w-full bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-3 mt-4 transition duration-200 ease-in-out cursor-pointer' onClick={handleUploadButtonClick}>업로드 하기</button>
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