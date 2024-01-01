import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import TextInput from "./TextInput";
import { useRecipes } from "../contexts/recipes/RecipesContext";

export default function Search() {
  const { fetchRecipes } = useRecipes();
  const [recipeName, setRecipeName] = useState<string>("");

  useEffect(() => {
    fetchRecipes({ recipeName: recipeName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeName]);

  return (
    <div className="flex flex-1 justify-center items-center text-sec-100">
      <form
        className="flex flex-1 justify-center items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          fetchRecipes({ recipeName: recipeName });
        }}
      >
        <TextInput
          placeholder="Search for a Recipe"
          onChange={(value) => setRecipeName(value)}
          textValue={recipeName}
          leftIcon={<FiSearch />}
          rightIcon={
            recipeName != "" && (
              <FiX
                className="cursor-pointer"
                onClick={() => setRecipeName("")}
              />
            )
          }
        />
      </form>
    </div>
  );
}
