import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditNote() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorId, setAuthorId] = useState(null); 
  const [createdAt, setCreatedAt] = useState(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const response = await fetch(`http://localhost:5000/notes/${id}`);
      const note = await response.json();
      setTitle(note.title);
      setBody(note.body);
      setAuthorId(note.authorId);
      setCreatedAt(note.createdAt);
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title) {
      newErrors.title = 'Название не может быть пустым';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    await fetch(`http://localhost:5000/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        authorId, 
        createdAt, 
        updatedAt: Date.now(),
      }),
    });

    navigate(`/notes/${id}`);
  };

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
          <h1 className="text-2xl font-bold mb-4 text-center">Редактирование заметки</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300">Название заметки</label>
              <input
                type="text"
                placeholder="Введите название заметки"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded mt-1 bg-gray-700 text-white"
                required
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-300">Тело заметки</label>
              <textarea
                placeholder="Введите текст заметки"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded mt-1 bg-gray-700 text-white"
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Сохранить</button>
          </form>
          <br />
          <a href="/notes" className="text-blue-500 hover:underline">Назад</a>
        </div>
      </main>
    </div>
  );
}

export default EditNote;
