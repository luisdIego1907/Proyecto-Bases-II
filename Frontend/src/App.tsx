import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./shared/Header";
import Home from "./features/home/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;