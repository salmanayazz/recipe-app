import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RecipeList from './pages/RecipeList';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeList />} >
          <Route path="create" element={<CreateRecipe />} />
          <Route path=":recipeName" element={<RecipeDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
