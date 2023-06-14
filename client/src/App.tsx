import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RecipeList from './pages/RecipeList';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetails from "./pages/RecipeDetails";
import EditRecipe from "./pages/EditRecipe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeList />} >
          <Route path="create" element={<CreateRecipe />} />
          <Route path=":recipeId" element={<RecipeDetails />} />
          <Route path=":recipeId/edit" element={<EditRecipe />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
