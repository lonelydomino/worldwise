import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";
import PageNav from "../components/PageNav";

const Homepage = () => {
  return (
    <div>
        <PageNav />
        <AppNav />
      <h1> Worldwise</h1>
      <Link to='/app'>Go to the app</Link>
    </div>
  );
};

export default Homepage;
