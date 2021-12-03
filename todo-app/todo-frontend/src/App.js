import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import TodoView from './Todos/TodoView'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/:id' element={<TodoView />} />
        <Route path='/'element={<TodoView />} />
      </Routes>
    </Router>
  );
}

export default App;
