import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import Button from "../components/Button";
import CardContainer from "../components/CardContainer";
import InputField from "../components/InputField";
import FlashcardItem from "../components/FlashcardItem";

const List = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [sortOption, setSortOption] = useState(
    localStorage.getItem("sortOption") || "newest"
  );
  const [expandedGroups, setExpandedGroups] = useState({});
  const [modal, setModal] = useState({ type: null, data: null });
  const [editForm, setEditForm] = useState({
    word: "",
    translation: "",
    definition: "",
    group: "",
  });
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    else
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/flashcards`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then(({ data }) => setFlashcards(sortFlashcards(data, sortOption)))
        .catch((err) =>
          setError(err.response?.data?.error || "Failed to load flashcards")
        );
  }, [sortOption, user, navigate]);

  useEffect(() => localStorage.setItem("sortOption", sortOption), [sortOption]);

  const groupedFlashcards = flashcards.reduce((acc, card) => {
    const group = card.group || "Ungrouped";
    acc[group] = acc[group] || [];
    acc[group].push(card);
    return acc;
  }, {});

  const sortFlashcards = (cards, option) =>
    [...cards].sort((a, b) => {
      switch (option) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "az":
          return a.word.localeCompare(b.word);
        case "za":
          return b.word.localeCompare(a.word);
        default:
          return 0;
      }
    });

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const openModal = (type, data) => setModal({ type, data });

  const closeModal = () => {
    setModal({ type: null, data: null });
    setEditForm({ word: "", translation: "", definition: "", group: "" });
    setNewGroupName("");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/flashcards/${modal.data._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setFlashcards(flashcards.filter((card) => card._id !== modal.data._id));
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete flashcard");
    }
  };

  const handleEditSave = async () => {
    if (Object.values(editForm).some((v) => !v.trim())) {
      setError("All fields are required");
      return;
    }
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/flashcards/${modal.data._id}`,
        editForm,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setFlashcards(
        sortFlashcards(
          flashcards.map((card) => (card._id === modal.data._id ? data : card)),
          sortOption
        )
      );
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update flashcard");
    }
  };

  const handleGroupSave = async () => {
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    if (
      newGroupName !== modal.data &&
      Object.keys(groupedFlashcards).includes(newGroupName)
    ) {
      setError("Group name already exists");
      return;
    }
    try {
      const groupCards = flashcards.filter(
        (card) => (card.group || "Ungrouped") === modal.data
      );
      await Promise.all(
        groupCards.map((card) =>
          axios.put(
            `${import.meta.env.VITE_API_URL}/api/flashcards/${card._id}`,
            { ...card, group: newGroupName },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
        )
      );
      setFlashcards(
        sortFlashcards(
          flashcards.map((card) =>
            (card.group || "Ungrouped") === modal.data
              ? { ...card, group: newGroupName }
              : card
          ),
          sortOption
        )
      );
      setExpandedGroups((prev) => {
        const newExpanded = { ...prev };
        if (newGroupName !== modal.data) {
          newExpanded[newGroupName] = newExpanded[modal.data] || false;
          delete newExpanded[modal.data];
        }
        return newExpanded;
      });
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update group name");
    }
  };

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-black">
        <ErrorMessage error={error} />
      </div>
    );

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
          </CardContainer>

          {Object.keys(groupedFlashcards)
            .sort()
            .map((group) => {
              const groupCards = groupedFlashcards[group] || [];
              return (
                <div key={group} className="w-full max-w-md">
                  <div
                    className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 cursor-pointer"
                    onClick={() => toggleGroup(group)}
                  >
                    <h2 className="text-base font-semibold text-black">
                      {group} ({groupCards.length})
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal("editGroup", group);
                          setNewGroupName(group);
                        }}
                        variant="secondary"
                        className="text-sm px-2 py-1"
                      >
                        Edit
                      </Button>
                      <motion.button
                        className="text-black"
                        animate={{ rotate: expandedGroups[group] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {expandedGroups[group] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedGroups[group] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-2 mt-2 overflow-hidden"
                      >
                        {sortFlashcards(groupCards, sortOption).map(
                          (card, index) => (
                            <motion.div
                              key={card._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <FlashcardItem
                                card={card}
                                onEdit={(card) => {
                                  openModal("editCard", card);
                                  setEditForm({
                                    word: card.word,
                                    translation: card.translation,
                                    definition: card.definition,
                                    group: card.group || "Ungrouped",
                                  });
                                }}
                                onDelete={() => openModal("delete", card)}
                              />
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </>
      )}

      <Modal
        isOpen={modal.type === "delete"}
        onClose={closeModal}
        title="Confirm Deletion"
        footer={
          <>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-white mb-6">
          Are you sure you want to delete the flashcard for "{modal.data?.word}
          "?
        </p>
      </Modal>

      <Modal
        isOpen={modal.type === "editCard"}
        onClose={closeModal}
        title="Edit Flashcard"
        footer={
          <>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="primary">
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {["word", "translation", "definition", "group"].map((field) => (
            <InputField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={editForm[field]}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder={`Enter ${field}`}
              isTextarea={field === "definition"}
            />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={modal.type === "editGroup"}
        onClose={closeModal}
        title="Edit Group Name"
        footer={
          <>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleGroupSave} variant="primary">
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputField
            label="Group Name"
            name="newGroupName"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter new group name"
          />
        </div>
      </Modal>
    </div>
  );
};

export default List;
