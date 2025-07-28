import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { store, persistor } from './redux/store';
import { ThemeProvider } from './components/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Exercise from './pages/Exercise';
import FlashcardExercise from './pages/FlashcardExercise';
import SpellingExercise from './pages/SpellingExercise';
import SelectWordsExercise from './pages/SelectWordsExercise';
import CustomPractice from './pages/CustomPractice';
import FlashcardFlipSelected from './pages/FlashcardFlipSelected'; // Import new component
import List from './pages/List';
import NotFound from './pages/NotFound';
import CreateFlashcard from './pages/CreateFlashcard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from '../PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<List />} />
                  <Route path="list" element={<List />} />
                  <Route path="exercise" element={<Exercise />} />
                  <Route path="exercise/flip" element={<FlashcardExercise />} />
                  <Route path="exercise/spelling" element={<SpellingExercise />} />
                  <Route path="exercise/select" element={<SelectWordsExercise />} />
                  <Route path="exercise/custom" element={<CustomPractice />} />
                  <Route path="exercise/flip-selected" element={<FlashcardFlipSelected />} /> {/* New route */}
                  <Route path="create" element={<CreateFlashcard />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;