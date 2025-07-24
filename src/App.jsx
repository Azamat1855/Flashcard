import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Exercise from './pages/Exercise'
import List from './pages/List'
import NotFound from './pages/NotFound'
import CreateFlashcard from './pages/CreateFlashcard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="exercise" element={<Exercise />} />
        <Route path="list" element={<List />} />
        <Route path="create" element={<CreateFlashcard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
