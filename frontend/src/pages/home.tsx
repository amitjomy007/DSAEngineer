import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const handleButtonClick = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      <button onClick={() => handleButtonClick("/problems")}>problems</button>
      <button onClick={() => handleButtonClick("/solutions")}>solutions</button>
    </div>
  );
};

export default Home;
