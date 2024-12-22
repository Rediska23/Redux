import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Notes({ notes, setNotes }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(localStorage.getItem('sortOrder') || 'desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const response = await fetch(`http://localhost:5000/notes?authorId=${currentUser.id}`);
        const data = await response.json();
        setNotes(data);
      }
    };
    fetchNotes();
  }, [setNotes]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить заметку?");
    if (confirmed) {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE',
      });
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const handleNoteClick = (id) => {
    navigate(`/notes/${id}`);
  };

  const sortedNotes = notes
    .filter(note => note.title.includes(searchQuery) || note.body.includes(searchQuery))
    .sort((a, b) => sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <Link to="/home" className="mr-4 hover:underline">Домашняя страница</Link>
          <Link to="/notes" className="hover:underline">Заметки</Link>
        </div>
        <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/login'); }} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Выйти</button>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Заметки</h1>
          <input
            type="text"
            placeholder="Поиск заметок"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-700 text-white"
          />
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Сортировка:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>
          </div>
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div key={note.id} onClick={() => handleNoteClick(note.id)} className="cursor-pointer mb-4 p-4 bg-gray-700 rounded">
                <h2 className="text-xl font-bold">{note.title}</h2>
                <p className="text-gray-300">{note.body}</p>
                <small>Дата создания: {new Date(note.createdAt).toLocaleDateString()}</small>
                <div className="flex mt-2">
                  <a href={`/notes/edit/${note.id}`} onClick={(e) => e.stopPropagation()} className="text-blue-500 mr-4">✍️</a>
                  <span onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="text-red-500 cursor-pointer">🗑</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300">Нет заметок</p>
          )}
          <a href="/notes/create" className="text-blue-500 mt-4 inline-block">Создать новую заметку</a>
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  notes: state.notes,
});

const mapDispatchToProps = (dispatch) => ({
  setNotes: (notes) => dispatch({ type: 'SET_NOTES', payload: notes }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
