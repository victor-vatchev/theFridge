import React, { useState, useEffect, useContext } from 'react';
import { Route, Link, Routes, useNavigate } from 'react-router-dom';
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

// Recipe List Component
const RecipeList = () => {
    const { ingredients } = useContext(IngredientsContext);    
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        // Fetch the list of recipes from the server here
        // setRecipes(fetchedRecipes);
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

    return (
        <div>
            <Navbar />
            <h1>Recipes</h1>
            {recipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                    {recipe.name}
                </Link>
            ))}
            <Link to="/">Back</Link>
        </div>
    );
};


// Recipe Details Component
const RecipeDetails = ({ match }) => {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        // Fetch the recipe details from the server here
        // setRecipe(fetchedRecipe);
    }, [match.params.id]);

    return recipe ? (
        <div>
            <Navbar />
            {/* <h1>Recipe Details</h1> */}
            <h1>{recipe.name}</h1>
            {/* Display the recipe details here */}
            <Link to="/recipes">Back</Link>
        </div>
    ) : null;
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
                {/* <Route path="/recipes" element={<RecipeList />} /> */}
                <Route path="/recipe/:id" element={<RecipeDetails />} />
            </Routes>
        </IngredientsContext.Provider>
    );
};

export default FindRecipe;
