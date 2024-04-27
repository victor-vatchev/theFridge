import React, { useState, useEffect} from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from 'react-router-dom'; // Import Link for navigation
import './EditOrDelete.css';

function EditOrDelete() {
    const[recipes, setRecipes] = useState([]);
    const[selectedRecipe, setSelectedRecipe] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/getRecipeNames')
            .then(response => response.json())
            .then(data => setRecipes(data.recipes)) // Extract 'recipes' key here
            .catch(error => console.error('Error fetching recipes:', error));
    }, []);

    const handleEdit = () => {
        navigate('/EditRecipe/', { state: { recipeId: selectedRecipe } }); // Pass recipeId as state
    };

    const handleDelete = () => {
        fetch(`/deleteRecipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeId: selectedRecipe }),
        })
        .then(() => {
            setRecipes(recipes.filter(recipe => recipe.id !== selectedRecipe));
            setSelectedRecipe(null);
        })
        .then(() => {
            alert("Recipe deleted successfully")
            navigate('/');
        })
        .catch(error => console.error('Error deleting recipe:', error));
    };

    return (
        <div>
            <Navbar />
            <div className="edit-delete-container">
                <h1>Edit Or Delete Recipe</h1>
                <select value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
                    <option value="">Select a recipe</option>
                    {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.recipeName}
                        </option>
                    ))}
                </select>
                <button onClick={handleEdit} disabled={!selectedRecipe}>Edit</button>
                <button onClick={handleDelete} disabled={!selectedRecipe}>Delete</button>
            </div>
        </div>
    );
}

export default EditOrDelete