import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gray-800 text-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Страница не найдена</h1>
        {currentUser ? (
          <Link to="/home" className="text-blue-500 hover:underline">Вернуться на домашнюю страницу</Link>
        ) : (
          <Link to="/login" className="text-blue-500 hover:underline">Перейти на страницу входа</Link>
        )}
      </div>
    </div>
  );
}

export default NotFound;
