import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { SignUpForm } from "./components/SignUpForm/SignUpForm"
import { SearchResults } from "./components/SearchResults/SearchResults";
import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/profile-settings" element={<ProfileForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/searchResults" element={<SearchResults />} />

          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
