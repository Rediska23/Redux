import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`http://localhost:5000/notes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data);
      } else {
        setNote(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить заметку?");
    if (confirmed) {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE',
      });
      navigate('/notes');
    }
  };

  if (note === null) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Загрузка...</div>;
  } else if (!note) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Заметка не найдена</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <Link to="/home" className="mr-4 hover:underline">Домашняя страница</Link>
          <Link to="/notes" className="hover:underline">Заметки</Link>
        </div>
        <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/login'); }} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Выйти</button>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">{note.title}</h1>
          <pre className="bg-gray-700 p-4 rounded mb-4 whitespace-pre-wrap">{note.body}</pre>
          <small>Дата создания: {new Date(note.createdAt).toLocaleDateString()}</small>
          <div className="flex mt-4">
            <button onClick={() => navigate(`/notes/edit/${note.id}`)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2">✍️ Редактировать</button>
            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">🗑 Удалить</button>
          </div>
          <a href="/notes" className="text-blue-500 hover:underline mt-4 block">Назад</a>
        </div>
      </main>
    </div>
  );
}

export default ViewNote;
