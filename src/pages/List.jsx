import React, { useEffect, useState } from "react";

const List = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem("sortOption") || "newest";
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editForm, setEditForm] = useState({
    word: "",
    translation: "",
    definition: "",
  });

  const fetchFlashcards = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rawData = localStorage.getItem("flashcards");
        const data = rawData ? JSON.parse(rawData) : [];
        resolve({ data });
      }, 500);
    });
  };

  const sortFlashcards = (cards, option) => {
    const sorted = [...cards];
    switch (option) {
      case "newest":
        return sorted.reverse();
      case "oldest":
        return sorted;
      case "az":
        return sorted.sort((a, b) => a.word.localeCompare(b.word));
      case "za":
        return sorted.sort((a, b) => b.word.localeCompare(a.word));
      default:
        return sorted;
    }
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetchFlashcards();
      const sorted = sortFlashcards(response.data, sortOption);
      setFlashcards(sorted);
    };

    getData();
  }, [sortOption]);

  useEffect(() => {
    localStorage.setItem("sortOption", sortOption);
  }, [sortOption]);

  const handleDeleteClick = (card) => {
    setSelectedCard(card);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedFlashcards = flashcards.filter(
      (card) => card.id !== selectedCard.id
    );
    setFlashcards(updatedFlashcards);
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
    setDeleteModalOpen(false);
    setSelectedCard(null);
  };

  const handleEditClick = (card) => {
    setSelectedCard(card);
    setEditForm({
      word: card.word,
      translation: card.translation,
      definition: card.definition,
    });
    setEditModalOpen(true);
  };

  const handleEditSave = () => {
    const updatedFlashcards = flashcards.map((card) =>
      card.id === selectedCard.id ? { ...card, ...editForm } : card
    );
    setFlashcards(sortFlashcards(updatedFlashcards, sortOption));
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
    setEditModalOpen(false);
    setSelectedCard(null);
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

  return (
    <div className="mt-6 mb-24 px-4 flex flex-col items-center space-y-6">
      {flashcards.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-black">
          No flashcards found.
        </div>
      ) : (
        <>
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-3 text-black flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <p className="text-sm font-medium text-center sm:text-left">
              Total Words:{" "}
              <span className="font-semibold">{flashcards.length}</span>
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
          </div>

          {flashcards.map((card) => (
            <div
              key={card.id}
              className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl text-black overflow-hidden"
            >
              <div className="bg-gradient-to-l from-indigo-300 to-purple-300 backdrop-blur-sm px-6 py-3 border-b border-white/20">
                <h2 className="text-lg font-semibold text-center">
                  {card.word}
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-sm text-center">
                  <span className="font-medium">Translation:</span>{" "}
                  {card.translation}
                </p>
                <p className="italic text-center">{card.definition}</p>
              </div>
              <div className="flex border-t border-white/20">
                <button
                  onClick={() => handleEditClick(card)}
                  className="w-1/2 px-4 py-2 bg-white/20 text-black border-r border-white/20 hover:bg-white/30 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(card)}
                  className="w-1/2 px-4 py-2 bg-white/20 text-black hover:bg-white/30 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm w-full text-white">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete the flashcard for "
              {selectedCard?.word}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white hover:bg-white/30 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm w-full text-white">
            <h3 className="text-lg font-semibold mb-4">Edit Flashcard</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Word</label>
                <input
                  type="text"
                  name="word"
                  value={editForm.word}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-white"
                  placeholder="Enter word"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Translation</label>
                <input
                  type="text"
                  name="translation"
                  value={editForm.translation}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-white"
                  placeholder="Enter translation"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Definition</label>
                <input
                  type="text"
                  name="definition"
                  value={editForm.definition}
                  onChange={handleEditChange}
                  className="w-full mt-1 px-3 py-2 bg-white/20 border border-white/20 rounded-lg text-white"
                  placeholder="Enter definition"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-white/20 border border-white/20 rounded-lg text-white hover:bg-white/30 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-indigo-500/80 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
