import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import Button from '../components/Button';
import CardContainer from '../components/CardContainer';
import InputField from '../components/InputField';
import FlashcardItem from '../components/FlashcardItem';

const List = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [sortOption, setSortOption] = useState(() => localStorage.getItem('sortOption') || 'newest');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editForm, setEditForm] = useState({
    word: '',
    translation: '',
    definition: '',
    group: '',
  });
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchFlashcards = async () => {
      try {
        console.log('Fetching flashcards with token:', user.token);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/flashcards`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log('Flashcards response:', { status: response.status, data: response.data });
        const sorted = sortFlashcards(response.data, sortOption);
        setFlashcards(sorted);
      } catch (err) {
        console.error('Fetch flashcards error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        setError(err.response?.data?.error || err.message || 'Failed to load flashcards');
        setFlashcards([]);
      }
    };
    fetchFlashcards();
  }, [sortOption, user, navigate]);

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption);
  }, [sortOption]);

  // Group flashcards by group field
  const groupedFlashcards = flashcards.reduce((acc, card) => {
    const group = card.group || 'Ungrouped';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(card);
    return acc;
  }, {});

  const sortFlashcards = (cards, option) => {
    const sorted = [...cards];
    switch (option) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'az':
        return sorted.sort((a, b) => a.word.localeCompare(b.word));
      case 'za':
        return sorted.sort((a, b) => b.word.localeCompare(b.word));
      default:
        return sorted;
    }
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
    console.log('Toggled group:', group, 'Expanded:', !expandedGroups[group]);
  };

  const handleDeleteClick = (card) => {
    setSelectedCard(card);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Deleting flashcard:', selectedCard._id);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/flashcards/${selectedCard._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Flashcard deleted successfully');
      setFlashcards(flashcards.filter((card) => card._id !== selectedCard._id));
      setDeleteModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      console.error('Delete flashcard error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      setError(err.response?.data?.error || err.message || 'Failed to delete flashcard');
    }
  };

  const handleEditClick = (card) => {
    setSelectedCard(card);
    setEditForm({
      word: card.word,
      translation: card.translation,
      definition: card.definition,
      group: card.group || 'Ungrouped',
    });
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      console.log('Updating flashcard:', selectedCard._id, editForm);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/flashcards/${selectedCard._id}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}` },
        }
      );
      console.log('Flashcard updated:', response.data);
      setFlashcards(
        sortFlashcards(
          flashcards.map((card) => (card._id === selectedCard._id ? response.data : card)),
          sortOption
        )
      );
      setEditModalOpen(false);
      setSelectedCard(null);
    } catch (err) {
      console.error('Update flashcard error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
      setError(err.response?.data?.error || err.message || 'Failed to update flashcard');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModals = () => {
    setDeleteModalOpen(false);
    setEditModalOpen(false);
    setSelectedCard(null);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="mt-6 mb-24 px-4 flex flex-col items-center space-y-4">
      {flashcards.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-black">
          No flashcards found.
        </div>
      ) : (
        <>
          <CardContainer className="text-black flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <p className="text-sm font-medium text-center sm:text-left">
              Total Words: <span className="font-semibold">{flashcards.length}</span>
            </p>
            <select
              className="text-sm text-black bg-white/30 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 shadow-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          </CardContainer>

          {Object.keys(groupedFlashcards).sort().map((group) => {
            const groupCards = groupedFlashcards[group] || [];
            return (
              <div key={group} className="w-full max-w-md">
                <div
                  className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 cursor-pointer"
                  onClick={() => toggleGroup(group)}
                >
                  <h2 className="text-base font-semibold text-black">{group} ({groupCards.length})</h2>
                  <button className="text-black">
                    {expandedGroups[group] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {expandedGroups[group] && (
                  <div className="space-y-2 mt-2 transition-all duration-300">
                    {sortFlashcards(groupCards, sortOption).map((card) => (
                      <FlashcardItem
                        key={card._id}
                        card={card}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={closeModals}
        title="Confirm Deletion"
        footer={
          <>
            <Button onClick={closeModals} variant="secondary">Cancel</Button>
            <Button onClick={handleConfirmDelete} variant="danger">Delete</Button>
          </>
        }
      >
        <p className="text-sm text-black mb-6">
          Are you sure you want to delete the flashcard for "{selectedCard?.word}"?
        </p>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={closeModals}
        title="Edit Flashcard"
        footer={
          <>
            <Button onClick={closeModals} variant="secondary">Cancel</Button>
            <Button onClick={handleEditSave} variant="primary">Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Word"
            name="word"
            value={editForm.word}
            onChange={handleEditChange}
            placeholder="Enter word"
          />
          <InputField
            label="Translation"
            name="translation"
            value={editForm.translation}
            onChange={handleEditChange}
            placeholder="Enter translation"
          />
          <InputField
            label="Definition"
            name="definition"
            value={editForm.definition}
            onChange={handleEditChange}
            placeholder="Enter definition"
            isTextarea
          />
          <InputField
            label="Group"
            name="group"
            value={editForm.group}
            onChange={handleEditChange}
            placeholder="Enter group name"
          />
        </div>
      </Modal>
    </div>
  );
};

export default List;