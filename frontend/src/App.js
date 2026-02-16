import { BrowserRouter,Routes,Route } from "react-router-dom";
import Create from "./Create";
import Poll from "./Poll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Create/>}/>
        <Route path="/poll/:id" element={<Poll/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;