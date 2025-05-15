import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Optional for JS components like modals
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './components/Main';
import Home from './components/Home';
import AddPlatform from './components/AddPlatform';
import ProfilePage from './components/Profile';
import BookmarksPage from './pages/Bookmark';
import { BookmarkProvider } from './context/BookmarkContext';
import AllContests from './pages/AllContests';
function App() {
  return (
    <> 
      <BookmarkProvider>
    <Router> 
      {/* <div className="container">  */}
      {/* <Navbar/>                                                                                   */}
    <Routes>
    {/* <Route exact path="/" element={<Navbar/>}></Route> */}
          <Route exact path="/" element={<Home/>}></Route>
          {/* <Route exact path="/about" element={<About/>}></Route> */}
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/signup" element={<Signup/>}></Route>
          <Route exact path="/addplatform" element={<AddPlatform/>}></Route>
          <Route path="/bookmark" element={<BookmarksPage />} />
          <Route exact path="/profile" element={<ProfilePage/>}></Route>
          
          <Route exact path="/allcontests" element={<AllContests/>}></Route>
    </Routes>
    {/* </div> */}
    </Router> 
    </BookmarkProvider>
    </>
  );
}

export default App;
