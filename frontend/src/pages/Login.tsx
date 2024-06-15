import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/possgAxios';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (email.trim() !== '' && password.trim() !== '') {
      const loginResult = await login(email, password);

      if (loginResult) {
        navigate('/');
        console.log("token: ", loginResult.data.token);
        localStorage.setItem('token', loginResult.data.token);
      } else {
        console.error('login fail');
      }
    }
  };


  return (
    <>
    <div className='main-font'>
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto w-1/4"
              alt='logo'
              src="/img/logo_b.png"
            />
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder='이메일'
                  value={email}
                  required
                  onChange={handleEmailChange} // 입력값이 변경될 때 상태 업데이트
                  className="block w-full rounded-md border-0 px-5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder='비밀번호'
                  value={password}
                  required
                  onChange={handlePasswordChange} // 입력값이 변경될 때 상태 업데이트
                  className="block w-full rounded-md border-0 px-5 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="flex mt-3 justify-end">
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-navy-500 hover:text-green-400">
                      비밀번호 찾기
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center rounded-lg bg-blue-900 py-2 px-4 font-PretendardVariable text-lg font-semibold leading-tight text-white shadow-md transition duration-200 ease-in-out cursor-pointer mb-2"
                >
                  로그인
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              계정이 없으신가요?{'   '}
              <a href="/register" className="font-semibold leading-6 text-navy-500 hover:text-navy-400">
                &nbsp;회원가입하기
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </>
  );
};

export default Login;