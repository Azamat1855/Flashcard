import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Exercise from './pages/Exercise';
import List from './pages/List';
import NotFound from './pages/NotFound';
import CreateFlashcard from './pages/CreateFlashcard';
import Login from './pages/Login';
import Register from './pages/Register';
import { persistor, store } from './redux/store';
import PrivateRoute from '../PrivateRoute'; // Adjusted path based on your import

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<List />} />
                <Route path="exercise" element={<Exercise />} />
                <Route path="list" element={<List />} />
                <Route path="create" element={<CreateFlashcard />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;