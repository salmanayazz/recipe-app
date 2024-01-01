import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RecipeList from "./pages/RecipeList";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import EditRecipe from "./pages/EditRecipe";
import Authentication from "./pages/Authentication";
import { RecipesProvider } from "./contexts/recipes/RecipesProvider";
import AuthProvider from "./contexts/auth/AuthProvider";

function App() {
  return (
    <RecipesProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RecipeList />}>
              <Route path="create" element={<CreateRecipe />} />
              <Route path=":recipeId" element={<RecipeDetails />} />
              <Route path=":recipeId/edit" element={<EditRecipe />} />
              <Route path="/auth" element={<Authentication />} />
            </Route>
            <Route path="/auth" element={<Authentication />} />
          </Routes>
        </Router>
      </AuthProvider>
    </RecipesProvider>
  );
}

export default App;
