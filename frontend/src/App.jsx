import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PostDetail from "./pages/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Route>
        <Route element={<ProtectedRoute roles={["AUTHOR", "ADMIN"]} />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Route>
        \
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        {/* <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<div>Admin Panel</div>} />
        </Route> */}
      </Routes>
    </div>
  );
}

export default App;
