import "./App.css";
import Landing from "./components/Landing";
import {Route, Routes} from "react-router-dom";
import "./lib/i18n";
function App() {
  
  return (

    <Routes>
          <Route path="/" element = {<Landing />} />
      </Routes>
)
  // return(<Landing />)
}

export default App;
