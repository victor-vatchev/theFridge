import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './RecipeDetails.css';

const RecipeDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state ? location.state.recipe : null;

    if (!recipe) {
        return (
            <div>
                <Navbar />
                <h1>Recipe Details</h1>
                <p>No recipe selected</p>
            </div>
        );
    }

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div>
            <Navbar />
            <div className="recipe-details">
                <h1>{recipe.recipeName}</h1>
                <h2>Ingredients</h2>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.ingredient}: {ingredient.amount} {ingredient.measurement !== 'NA' ? ingredient.measurement : ''}</li>
                    ))}
                </ul>
                <h2>Instructions</h2>
                {/* <p>{recipe.instructions.description}</p> */}
                <ol>
                    {recipe.instructions.map((instructions, index) => (
                        <li key={index}>{instructions.description} </li>
                    ))}
                </ol>
                <button onClick={handleBackClick}>Back to Recipes</button>
            </div>
        </div>
    );
};


export default RecipeDetails;