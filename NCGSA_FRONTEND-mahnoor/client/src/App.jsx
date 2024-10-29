import Header from "./components/Header";
import HistoryScreen from "./screens/History/HistoryScreen";
import { Outlet } from "react-router-dom";
const App = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
export default App;
