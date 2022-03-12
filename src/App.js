import "./App.css";
import "./assets/css/tailwind.css";
import "./assets/css/animate.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navigation/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
