import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./shared/Header";
import Home from "./features/home/Home";
import ClientList from "./features/ClientList";
import ClientEditForm from "./components/forms/ClientEditForm";
import ClientRegisterForm from "./components/forms/ClientRegisterForm";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/register" element={<ClientRegisterForm />} />
            <Route path="/clients/:id" element={<ClientEditForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;