import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string()
    .min(8, { message: 'Пароль должен быть не менее 8 символов' })
    .regex(/[A-Z]/, { message: 'Пароль должен содержать хотя бы одну заглавную букву' })
    .regex(/[a-z]/, { message: 'Пароль должен содержать хотя бы одну строчную букву' })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

function Registration() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const [registrationError, setRegistrationError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          createdAt: Date.now()
        })
      });
      
      if (response.ok) {
        const newUser = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = "/home";
      } else {
        setRegistrationError('Ошибка регистрации');
      }
    } catch (error) {
      setRegistrationError('Ошибка сервера');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Регистрация</h1>
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
        <div className="mb-4">
          <label className="block text-gray-300">Повторите пароль</label>
          <input 
            type="password" 
            {...register('confirmPassword')} 
            className="w-full p-2 border border-gray-700 rounded mt-1 bg-gray-700 text-white" 
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Зарегистрироваться</button>
        <button 
          type="button" 
          onClick={() => window.location.href = "/login"} 
          className="w-full mt-2 text-blue-500 hover:underline"
        >
          Уже есть аккаунт? Войти
        </button>
        {registrationError && <p className="text-red-500 text-sm mt-2">{registrationError}</p>}
      </form>
    </div>
  );
}

export default Registration;
