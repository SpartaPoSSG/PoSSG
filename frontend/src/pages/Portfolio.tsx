import { Button } from 'flowbite-react';
import Footer from '../components/Footer';
import { FormEvent, useEffect, useState } from 'react';
import { getPortfolio, makePortfolio } from '../api/possgAxios';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Portfolio = () => {

  const token = localStorage.getItem('token');
  const [isExist, setExist] = useState<boolean>(false);
  const [myPortfolio, setMyPortfolio] = useState<File>();
  const [myPortfolioImg, setMyPortfolioImg] = useState<string>();
  
  const makePortfolioButton = async () => {
    if (token) {
      const successResponse = await makePortfolio(token);

      if (successResponse && successResponse.data.file) {
        setMyPortfolio(successResponse.data.file);
        setExist(true);
      }
    }
  };

  const fetchFile = async () => {
    if (token) {
        const successResponse = await getPortfolio(token);
        
        if (successResponse && successResponse.data.file) {
          setMyPortfolio(successResponse.data.file);
          setExist(true);
        }
    }
  };

  useEffect(() => {
    fetchFile();
  }, [token]);


  return (
    <>
    {isExist ? (
      <>
        <Document
          file={myPortfolio}
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
                      setMyPortfolioImg(imageUrl);
                    }
                  });
                });
              }
            });
          }}
        >
          <Page pageNumber={1} />
        </Document>
        <div className='bg-g flex w-screen justify-center self-stretch text-gray-700'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
              <div className='text-center mx-auto md:w-[80%]'>
                <img
                  className='w-full'
                  src={myPortfolioImg} 
                  alt="Portfolio Img"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className='bg-g flex w-screen justify-center self-stretch text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='text-center mx-auto md:w-[80%]'>
                  <div className="bg-gray-50 border border-gray-200 text-xs font-PretendardVariable font-normal rounded-md mt-10 px-3 py-5 mx-3 text-center">
                    <div className="flex justify-center items-center">
                      <img
                        alt="Character"
                        className="w-44 pt-20"
                        src="/img/charactor.png"
                      />
                    </div>
                    <p className='font-semibold text-lg'>포트폴리오가 없어요!</p>
                    <br></br><br></br>
                    <div className="flex justify-center items-center pb-20">
                      <Button
                          className='tracking-tighter border-none font-bold px-3 bg-blue-600 hover:bg-blue-700'
                          onClick={makePortfolioButton}
                      >
                          <p className='text-base'>3초만에 나만의 포트폴리오 만들기</p>
                      </Button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </div>
    )}
    <Footer />
    </>
  );
};
  
export default Portfolio;