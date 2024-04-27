import React, { useState, useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './FindRecipe.css';

export const IngredientsContext = React.createContext();

// Ingredient Input Component
const IngredientInput = () => {
    const { ingredients, setIngredients } = useContext(IngredientsContext);

    // const [ingredients, setIngredients] = useState(['']);
    const navigate = useNavigate();

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = event.target.value;
        setIngredients(newIngredients);
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setIngredients(newIngredients);
    };

    const handleContinue = () => {
        navigate('/Recipes', { state: { ingredients } });
    };

    return (
        <div>
            <Navbar />
            <div className='ingredients-container'>
                <h1>Enter Ingredients</h1>
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <input
                            name="ingredient"
                            value={ingredient.ingredient}
                            onChange={(e) => handleIngredientChange(index, e)}
                            placeholder="Ingredient"
                        />
                        <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddIngredient}>Add Ingredient</button>
                <button onClick={handleContinue}>Continue</button>
            </div>
        </div>
    );
};

// Main Component
const FindRecipe = () => {
    console.log('FindRecipe is rendering'); // Add this line

    const [ingredients, setIngredients] = useState(['']);

    console.log(ingredients);

    return (
        <IngredientsContext.Provider value={{ ingredients, setIngredients }}>
            <Routes>
                <Route path="/" element={<IngredientInput />} />
            </Routes>
        </IngredientsContext.Provider>
    );
};

export default FindRecipe;
