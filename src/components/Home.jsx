import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      dispatch({ type: 'SET_USER', payload: currentUser });
    }
    setLoading(false);
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT_USER' });
    navigate('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Загрузка...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Пользователь не найден</div>;
  }

  const formattedDate = new Date(user.createdAt).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <Link to="/home" className="mr-4 hover:underline">Домашняя страница</Link>
          <Link to="/notes" className="hover:underline">Заметки</Link>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Выйти</button>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Добро пожаловать на домашнюю страницу!</h1>
          <p className="mb-2">Электронная почта: {user.email}</p>
          <p>Дата и время регистрации: {formattedDate}</p>
        </div>
      </main>
    </div>
  );
}

export default Home;
