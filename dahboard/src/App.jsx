import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Ajoutez Navigate

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Si quelqu'un accède à /index.html, on le renvoie à la racine */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;