import TextEditor from "./components/TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={`/document/${uuidv4()}`} />} />
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
