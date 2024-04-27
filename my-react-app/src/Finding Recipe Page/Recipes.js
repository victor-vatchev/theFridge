import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import './Recipes.css';

const Recipes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ingredients = location.state.ingredients;    
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch('/findRecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ingredients: ingredients,
            }),
        })
        .then(response => response.json())
        .then(data => setRecipes(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }, [ingredients]);

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div>
            <Navbar />
            <div className="recipes">
                <h1>Recipes</h1>
                {recipes.map((recipe) => (
                    <button key={recipe.id} onClick={() => handleRecipeClick(recipe)}>
                        {recipe.recipeName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Recipes;
