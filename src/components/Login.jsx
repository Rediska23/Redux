import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(8, { message: 'Введите корректный пароль' }),
});

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:5000/users?email=${data.email}&password=${data.password}`);
      const users = await response.json();
      if (users.length > 0) {
        localStorage.setItem('currentUser', JSON.stringify(users[0]));
        window.location.href = "/home";
      } else {
        setLoginError("Неправильная почта или пароль");
      }
    } catch (error) {
      setLoginError("Ошибка сервера");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Вход</h1>
        <div className="mb-4">
          <label className="block text-gray-300">Электронная почта</label>
          <input 
            {...register('email')} 
            className="w-full p-2 border border-gray-700 rounded mt-1 bg-gray-700 text-white" 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Пароль</label>
          <input 
            type="password" 
            {...register('password')} 
            className="w-full p-2 border border-gray-700 rounded mt-1 bg-gray-700 text-white" 
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Войти</button>
        {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
      </form>
    </div>
  );
}

export default Login;
