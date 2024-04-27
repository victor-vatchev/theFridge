import React from 'react'; // Import React
import WelcomePage from './Welcome Page/WelcomePage'; // Import welcome page
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import routing components
import CreateRecipe from './Create Recipe Page/CreateRecipe'; // Import createrecipe component
import EditOrDelete from './EditOrDelete Page/EditOrDelete'; // Import editordelate component
import EditRecipe from './EditOrDelete Page/EditRecipe'; // Import editrecipe component
import FindRecipe from './Finding Recipe Page/FindRecipe'; // Import findrecipe component
import Recipes from './Finding Recipe Page/Recipes'; // Import recipes component
import RecipeDetails from './Finding Recipe Page/RecipeDetails'; // Import recipedetails component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} /> {/* Welcome page at root path */}
        <Route path="/CreateRecipe" element={<CreateRecipe />} /> {/* createrecipe at /createrecipe path */}
        <Route path="/EditOrDelete" element={<EditOrDelete />} /> {/* editordelate at /editordelate path */}
        <Route path="/EditRecipe" element={<EditRecipe />} /> {/* editrecipe at /editrecipe path */}
        <Route path="/FindRecipe" element={<FindRecipe />} /> {/* findrecipe at /findrecipe path */}
        <Route path="/Recipes" element={<Recipes />} /> {/* recipes at /recipes path */}
        <Route path="/recipe/:id" element={<RecipeDetails />} /> {/* recipes at /recipe/:id path */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;