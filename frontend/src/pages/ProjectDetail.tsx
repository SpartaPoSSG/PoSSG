import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiUpload } from "react-icons/bi";
import Footer from '../components/Footer';
import ProjectPreview from '../components/ProjectPreview';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const ProjectDetail = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const [isActive, setActive] = useState<boolean>(false);
  const [uploadedInfo, setUploadedInfo] = useState<any>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  const Logo = () => (
    <svg className="w-24 h-24 mt-5 pointer-events-none" x="0px" y="0px" viewBox="0 0 24 24">
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

    const file = e.dataTransfer.files[0];
    setFileInfo(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileInfo(file);
    }
  };

  const setFileInfo = (file: File) => {
    const { name, size: byteSize, type } = file;
    const size = (byteSize / (1024 * 1024)).toFixed(2) + 'MB';
    setUploadedInfo({ name, size, type });
    setUploadFile(file);

    // 미리보기 이미지 설정
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        setPreviewImage(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  

  return (
    <>
      <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-white text-gray-700'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
              <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary mx-auto md:w-[80%]'>
                  <div className='flex justify-between items-center pt-12 pb-2 border-b border-gray-500'>
                      <p className='text-xl font-PretendardVariable font-semibold ml-3'>{folderName}</p>
                      <label
                        htmlFor="fileInput"
                        className="bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-2 px-5 mr-3 transition duration-200 ease-in-out cursor-pointer"
                      >
                        파일 업로드
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept='.png, .jpeg, .pdf'
                        onChange={handleUpload}
                      />
                  </div>
                  <div className='mt-3'>
                    <label
                      className={`w-300 h-150 mx-auto bg-white rounded-lg outline-dashed outline-2 outline-gray-300 hover:outline-gray-500 p-70 flex flex-col justify-center items-center cursor-pointer${isActive ? ' bg-efeef3 border-111' : ''}`}
                      onDragEnter={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragEnd}
                      onDrop={handleDrop}
                    >
                      {uploadedInfo ? (
                        <>
                        {uploadedInfo.type === 'application/pdf' && (
                          <Document
                            file={uploadFile}
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
                                        setPreviewImage(imageUrl);
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
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div className='flex flex-col w-full p-2'>
                            <ProjectPreview
                                name={uploadedInfo.name}
                                src={previewImage}
                            />
                          </div>
                        </div>
                        </>
                      ) : (
                        <>
                          <Logo />
                          <p className="font-medium font-PretendardVariable text-lg my-20 mb-10">클릭 혹은 여러 파일을 이곳에 드롭하세요!</p>
                          <p className="mb-5 font-PretendardVariable text-sm">파일당 최대 3MB</p>
                        </>
                      )}
                      <input type="file" className="file hidden" accept='.png, .jpeg, .pdf' onChange={handleUpload} />
                    </label>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;
