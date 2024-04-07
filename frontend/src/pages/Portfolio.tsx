import Footer from '../components/Footer';

const Portfolio = () => {
    return (
      <>
      <div className='comp_content bg-g flex w-screen justify-center self-stretch bg-blue-100 text-gray-700'>
        <div className='flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 pt-20 pb-20'>
            <div className='flex-1 flex-grow-4 self-start max-w-none prose-lg mx-4 text-gray-700'>
                <div className='comp_summary  text-center mx-auto md:w-[80%]'>
                    <div>
                        <h2 className='text-4xl font-semibold font-mono pt-10 pb-5'>PoSSG Portfolio Test Page</h2>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer />
      </>
    );
  };
  
export default Portfolio;