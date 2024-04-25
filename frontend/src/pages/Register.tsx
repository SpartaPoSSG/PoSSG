import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmail, register } from '../api/possgAxios';

const Register = () => {
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

  const handleCheckEmail = async (e: FormEvent) => {
    const emailResult = await checkEmail(signupForm.email);

    if (emailResult?.data.isExist === true) {
      // 이메일 중복
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 불가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: false });
    } else {
      // 이메일 사용 가능
      setValidMessage((prev) => ({
        ...prev,
        emailMessage: "사용 가능한 이메일입니다.",
      }));
      setIsValid({ ...isValid, checkedPassword: true });
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
      setIsValid({...isValid, nickname: false });
    } else {
      setValidMessage((prev) => ({
        ...prev,
        nicknameMessage: "사용 가능한 닉네임입니다.",
      }));
      setIsValid({ ...isValid, nickname: true });
    }
  }, [signupForm.nickname, isValid]);

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
  }, [signupForm.password, isValid]);

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
  }, [signupForm.password, signupForm.checkedPassword, isValid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid.nickname && isValid.password && isValid.checkedPassword) {
      if (validMessage.emailMessage === "사용 가능한 이메일입니다.") {
        const registerResult = await register(signupForm.email, signupForm.password, signupForm.nickname);

        if (registerResult) {
          navigate('/login');
        } else {
          console.error('register fail');
        }
      } else {
        return;
      }
    } else {
      return;
    }    
  };

  return (
    <>
      <div className='main-font'>
        <section className="bg-white dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="register-box-container w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                  <div className='relative'>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={signupForm.email}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="이메일"
                      required
                    />
                    <button
                      className="absolute right-3 top-4 w-15 bg-blue-900 text-white text-xs font-PretendardVariable font-normal rounded-md py-1 px-2 transition duration-200 ease-in-out cursor-pointer"
                      onClick={handleCheckEmail}>중복확인
                    </button>
                    <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                      {validMessage.emailMessage}
                    </p>
                  </div>
                  <div className='relative'>
                    <input
                      type="text"
                      name="nickname"
                      id="nickname"
                      value={signupForm.nickname}
                      onChange={handleChange}
                      maxLength={10}
                      className={`bg-gray-50 border border-gray-300 text-gray-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="닉네임"
                      required
                    />
                    <p className={`text-gray-500 sm:text-sm ml-2 mt-1`}>
                      {validMessage.nicknameMessage}
                    </p>
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={signupForm.password}
                      onChange={handleChange}
                      placeholder="비밀번호"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <p className="text-red-500 sm:text-sm ml-2 mt-1">
                    {validMessage.passwordMessage}
                    </p>
                  </div>
                  <div>
                    <input
                      type="password"
                      name="checkedPassword"
                      id="checkedPassword"
                      placeholder="비밀번호 확인"
                      value={signupForm.checkedPassword}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <p className="text-red-500 sm:text-sm ml-2 mt-1">
                    {validMessage.checkedPasswordMessage}
                    </p>
                  </div>
                  <br></br>
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
                    className="w-full flex justify-center rounded-lg bg-blue-900 py-3 px-4 font-PretendardVariable text-lg font-medium leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer mb-2">
                    포쓱 시작하기
                  </button>
                  <p className="mt-10 text-center text-sm text-gray-500">
                    이미 회원가입을 하셨나요?&nbsp;&nbsp;&nbsp;
                    <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">로그인하기</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Register;