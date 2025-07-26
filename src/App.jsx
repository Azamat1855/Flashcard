import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Exercise from './pages/Exercise'
import List from './pages/List'
import NotFound from './pages/NotFound'
import CreateFlashcard from './pages/CreateFlashcard'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="exercise" element={<Exercise />} />
          <Route path="list" element={<List />} />
          <Route path="create" element={<CreateFlashcard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App