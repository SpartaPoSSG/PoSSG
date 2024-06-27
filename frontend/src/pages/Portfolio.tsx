import { Button } from 'flowbite-react';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { getPortfolio, makePortfolio, getRecommend } from '../api/possgAxios';
import { Document, Page, pdfjs } from "react-pdf";
import Loading1 from '../components/Loading1';
import Loading2 from '../components/Loading2';
import { MyPortfolio, portfolioInfo } from '../interfaces/Interfaces';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Portfolio = () => {
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState<boolean>(true);  // 통합된 로딩 및 존재 상태 변수
  const [myPortfolio, setMyPortfolio] = useState<MyPortfolio>();
  const [recommend, setRecommend] = useState<string>("");
  const [isRecommendLoading, setIsRecommendLoading] = useState<boolean>(false); // 직무 추천 로딩 상태 추가

  const makePortfolioButton = async () => {
    setIsLoading(true);
    console.log("포트폴리오 요청 후 로딩 중");
    if (token) {
      const successResponse = await makePortfolio(token);
      console.log("포트폴리오 요청 성공");
      if (successResponse && successResponse.data) {
        setMyPortfolio(successResponse.data);
        console.log("Response Data:", successResponse.data);
        setIsLoading(false);
      }
    }
  };

  const fetchFile = async () => {
    if (token) {
      const successResponse = await getPortfolio(token);
      if (successResponse && successResponse.data) {
        setMyPortfolio(successResponse.data);
        console.log(myPortfolio);
        console.log("Response Data:", successResponse.data);
      }
      setIsLoading(false);  // 로딩 종료
    }
  };

  const fetchRecommend = async () => {
    setIsRecommendLoading(true); // 로딩 시작
    console.log("직무추천 요청 후 로딩중")
    if (token) {
      const successResponse = await getRecommend(token);
      if (successResponse && successResponse.data) {
        setRecommend(successResponse.data.recommend); // 가정: 추천 응답 객체에 'recommend' 속성이 있음
        console.log("직무 요청 성공")
        setIsRecommendLoading(false); // 로딩 종료
        console.log("직무 추천 받아오기 성공");
      }
    }
  };



  useEffect(() => {
    fetchFile();
  }, [token]);

  const renderPdfDocument = () => {
    console.log(myPortfolio);
    // if (myPortfolio) {
    //   console.log("화면 띄우기")
    //   return (
    //     <Document
    //       file={myPortfolio}
    //       onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
    //     >
    //       <Page pageNumber={1} />
    //     </Document>
    //   );
    // }
  };

  // const renderPdfDocument = () => {
  //   if (myPortfolio) {
  //     const fileReader = new FileReader();
  //     fileReader.onload = () => {
  //       const pdfData = fileReader.result;
  //       if (typeof pdfData === 'string' || pdfData instanceof ArrayBuffer) {
  //         return (
  //           <Document
  //             file={pdfData}
  //             onLoadSuccess={onDocumentLoadSuccess}
  //           >
  //             {Array.from(new Array(numPages), (el, index) => (
  //               <Page key={`page_${index + 1}`} pageNumber={index + 1} />
  //             ))}
  //           </Document>
  //         );
  //       }
  //     };
  //     fileReader.readAsArrayBuffer(myPortfolio);
  //   }
  // };


  return (
    <>
      {isLoading && <Loading1 />}
      {!isLoading ? (
        <>
          {/* {renderPdfDocument()} */}
          {myPortfolio && Object.entries(myPortfolio).map(([key, item]) => (
              <div key={key}>
                  <h2 className='font-PretendardVariable'>{item.sector}</h2>
                  <p className='font-PretendardVariable'>{item.folderName}</p>
                  <pre className='font-PretendardVariable'>{item.results.replaceAll("*", "").replaceAll("#", "")}</pre>
              </div>
          ))}
        </>
      ) : (
        <div className='bg-g flex w-screen justify-center self-stretch text-gray-700'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-1'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
              <div className='text-center mx-auto md:w-[80%]'>
                <div className="bg-gray-50 border border-gray-200 text-xs font-normal rounded-md mt-10 px-3 py-5 mx-3 text-center">
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

      {isRecommendLoading && <Loading2 />}
      {!isRecommendLoading && recommend && (
        <div className="mt-4 pl-10 pr-10 pt-10 pb-10 bg-blue-100 rounded-2xl text-left text-lg">
          1. Machine Learning Engineer with Front-End Expertise: <br />
          머신 러닝 모델을 개발하고 이를 웹 애플리케이션에 통합하는 역할입니다. 프론트 엔드 기술을 활용해 데이터 시각화 및 인터랙티브 UI를 개발할 수 있습니다.<br />
          <br />
          2. Data Visualization Engineer: <br />
          대량의 데이터를 시각적으로 표현하는 작업을 담당합니다. 데이터 시각화 라이브러리(D3.js, Chart.js 등)를 사용하여 인사이트를 쉽게 이해할 수 있는 형태로 제공하는 역할입니다.<br />
          <br />
          3. Full-Stack Developer: <br />
          프론트 엔드와 백 엔드 모두를 다루는 포지션으로, AI 기능을 포함한 웹 애플리케이션을 설계, 개발 및 유지보수합니다. 프론트 엔드와 백 엔드 기술 모두가 요구됩니다.
        </div>
      )}

      {!isRecommendLoading && !recommend && (
        <div className='bg-g flex w-screen justify-center self-stretch text-gray-700'>
          <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
              <div className='text-center mx-auto md:w-[80%]'>
                <div className="bg-gray-50 border border-gray-200 text-xs font-PretendardVariable font-normal rounded-md mt-10 px-3 py-5 mx-3 text-center">
                  <div className="flex justify-center items-center">
                    <img alt="Character" className="w-44 pt-20 pb-10" src="/img/logo.png" />
                  </div>
                  <p className='font-semibold text-lg'>직무 추천을 받아보세요!</p>
                  <br /><br />
                  <div className="flex justify-center items-center pb-20">
                    <Button className='tracking-tighter border-none font-bold px-3 bg-blue-600 hover:bg-blue-700' onClick={fetchRecommend}>
                      <p className='text-base'>직무 추천 받기</p>
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
