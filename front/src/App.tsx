import './App.css';
import Header from './components/header/Header';
import { Outlet } from 'react-router-dom';
import Nav from './components/nav/Nav';


function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-row">
          <Nav/>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
