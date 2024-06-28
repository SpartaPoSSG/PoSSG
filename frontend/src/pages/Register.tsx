import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmail, register } from '../api/possgAxios';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const Register = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openFailModal, setOpenFailModal] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    nickname: "",
    password: "",
    checkedPassword: ""
  });

  // 오류 메세지
  const [validMessage, setValidMessage] = useState({
    emailMessage: "",
    nicknameMessage: "",
    passwordMessage: "",
    checkedPasswordMessage: "",
  });

  // 유효성 검사
  const [isValid, setIsValid] = useState({
    email: false,
    nickname: false,
    password: false,
    checkedPassword: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  }

  const handleCheckEmail = async () => {
    const emailResult = await checkEmail(signupForm.email);

    if (emailResult?.data.isExist === true) {
      // 이메일 중복
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 불가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: false });
    } else if (emailResult?.data.isExist == false) {
      // 이메일 사용 가능
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: true });
    } else {
      // 기타 상황
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "잠시 후 다시 시도해주세요.",
      }));
      setIsValid({ ...isValid, checkedPassword: false });
    }
  };

  // 닉네임 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/;

    if (!regex.test(signupForm.nickname)) {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "2자 이상 10자 이하로 입력해주세요.",
      }));
      setIsValid({ ...isValid, nickname: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "사용 가능한 닉네임입니다.",
      }));
      setIsValid({ ...isValid, nickname: true });
    }
  }, [signupForm.nickname]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,15}$/;

    if (!regex.test(signupForm.password)) {
      setValidMessage((prev) => ({
        ...prev,
        passwordMessage: "숫자, 영문, 특수문자를 포함하여 최소 8자를 입력해주세요",
      }));
      setIsValid({ ...isValid, password: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        passwordMessage: "",
      }));
      setIsValid({ ...isValid, password: true });
    }
  }, [signupForm.password]);

  // 비밀번호 확인
  useEffect(() => {
    if (signupForm.password !== signupForm.checkedPassword) {
      setValidMessage((prev) => ({
        ...prev,
        checkedPasswordMessage: "비밀번호가 일치하지 않습니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        checkedPasswordMessage: "",
      }));
      setIsValid({ ...isValid, checkedPassword: true });
    }
  }, [signupForm.password, signupForm.checkedPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid) {
      const registerResult = await register(signupForm.email, signupForm.password, signupForm.nickname);

      if (registerResult) {
        setOpenModal(true);
      } else {
        setOpenFailModal(false);
        console.error('register fail');
      }
    } else {
      setOpenFailModal(false);
      console.error('register fail');
      return;
    }
  };

  const handleSuccessPopUp = () => {
    setOpenModal(false);
    if (!openFailModal) navigate('/login');
  }


  return (
    <>
       <div className='bg-blue-600 w-screen min-h-screen'>
        <section className="dark:bg-gray-900">
          <div className='flex justify-between pt-10 px-20'>
            <div className='text-white text-3xl leading-snug flex flex-col justify-center min-h-screen'>
              <div className='px-10'>
                <p className='font-semibold text-3xl leading-tight'>걱정하지 마세요,<br></br>포트폴리오는 간단합니다.</p><br></br>
                <p className='font-semibold text-2xl leading-tight'>포트폴리오를 한 번에 쓱!</p>
                <p className='font-semibold text-2xl'>
                  <span className='text-3xl font-semibold'>POSSG</span>
                  과 함께 나만의 멋진 포트폴리오를 만들어 보세요.
                </p>
              </div>
              <img
                className="w-80 pl-10 pt-10 mt-20"
                src={`/img/charactor.png`}
                alt="possg-charactor"
              />
            </div>

            <div className="flex flex-col items-end justify-center px-6 py-8 mt-10">
              <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                    <div className='relative'>
                      <p className='mb-1 ml-1 text-sm'>이메일</p>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={signupForm.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="이메일을 입력해주세요"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-10 w-15 bg-blue-600 text-white text-xs font-normal rounded-md py-1 px-2 transition duration-200 ease-in-out cursor-pointer"
                        onClick={handleCheckEmail}>중복확인
                      </button>
                      <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                        {validMessage.emailMessage}
                      </p>
                    </div>
                    <div className='relative'>
                      <p className='mb-1 ml-1 text-sm'>닉네임</p>
                      <input
                        type="text"
                        name="nickname"
                        id="nickname"
                        value={signupForm.nickname}
                        onChange={handleChange}
                        maxLength={10}
                        className={`bg-gray-50 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        placeholder="닉네임"
                        required
                      />
                      <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                        {validMessage.nicknameMessage}
                      </p>
                    </div>
                    <div>
                      <p className='mb-1 ml-1 text-sm'>비밀번호</p>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={signupForm.password}
                        onChange={handleChange}
                        placeholder="영문자, 숫자, 특수문자 포함 8~20자리"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 sm:text-sm ml-2 mt-1 mb-2">
                        {validMessage.passwordMessage}
                      </p>
                      <input
                        type="password"
                        name="checkedPassword"
                        id="checkedPassword"
                        placeholder="비밀번호 확인"
                        value={signupForm.checkedPassword}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-96 p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 sm:text-sm ml-2 mt-1">
                        {validMessage.checkedPasswordMessage}
                      </p>
                    </div>
                    <br />
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          aria-describedby="terms"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                          포쓱의 <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="/">이용약관</a>에 동의합니다.</label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={() => setOpenModal(true)}
                      className="w-full flex justify-center rounded-lg bg-blue-600 py-3 px-4 text-lg font-semibold leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer mb-2">
                      회원가입
                    </button>
                    <p className="mt-10 text-center text-sm text-gray-500">
                      이미 회원가입을 하셨나요?&nbsp;&nbsp;&nbsp;
                      <a href="/login" className="font-semibold text-primary-600 hover:underline dark:text-primary-500">로그인하기</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <div className='fixed top-20 left-0 w-full h-full bg-gray-500 bg-opacity-60'></div>
            <div className='flex items-center justify-center fixed inset-0 opacity-100'>
                <div className='z-10 bg-white rounded-lg border-solid border-black-500 p-70 flex flex-col justify-center items-center'>
                    <Modal.Body>
                    <div className="text-center px-10">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-black-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400 shadow-3xl">
                            {openFailModal ? "회원가입에 실패했습니다" : "포쓱의 회원이 되신 걸 환영합니다!"}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button className="bg-gray-100 text-black w-20 hover:bg-blue-600 hover:text-white" onClick={handleSuccessPopUp}>
                                확인
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </div>
        </div>
      </Modal>
    </>
  );
}
  export default Register;
