import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';
import './EditRecipe.css';

function EditRecipe() {
    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const location = useLocation();
    const recipeId = location.state.recipeId;

    useEffect(() => {
        fetch(`/getRecipe/${recipeId}`)
            .then(response => response.json())
            .then(data => {
                setRecipeName(data.recipeName);
                setIngredients(data.ingredients);
                setInstructions(data.instructions);
            })
            .catch(error => console.error('Error fetching recipe:', error));
    }, [recipeId]);

    const handleIngredientChange = (index, event) => {
        const values = [...ingredients];
        values[index][event.target.name] = event.target.value;
        setIngredients(values);
    };

    const handleInstructionChange = (index, event) => {
        const values = [...instructions];
        values[index] = event.target.value;
        setInstructions(values);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient: "", amount: "", measurement: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    const handleRemoveInstruction = (index) => {
        const values = [...instructions];
        values.splice(index, 1);
        setInstructions(values);
    };

    const handleUpdateRecipe = () => {
        fetch(`/updateRecipe/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeName, ingredients, instructions }),
        })
        .then(response => response.json())
        .then(() => {
            alert("Recipe updated successfully!");
            window.location.href = '/';
        })
        .catch(error => console.error('Error updating recipe:', error));
    };

    return (
        <div>
            <Navbar />
            <div className="edit-recipe-container">
                <h1>Edit Recipe</h1>
                <input
                    name="recipeName"
                    value={recipeName}
                    onChange={e => setRecipeName(e.target.value)}
                    placeholder="Recipe Name"
                />
                <br></br>
                <br></br>
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <input
                            name="ingredient"
                            value={ingredient.ingredient}
                            onChange={e => handleIngredientChange(index, e)}
                            placeholder="Ingredient"
                        />
                        <input
                            type="number"
                            name="amount"
                            value={ingredient.amount}
                            onChange={e => handleIngredientChange(index, e)}
                            placeholder="Amount"
                        />
                        <select name="measurement" value={ingredient.measurement} onChange={(e) => handleIngredientChange(index, e)}>
                                <option value="">Measurement</option>
                                <option value="NA"> </option>
                                <option value="cups">cups</option>
                                <option value="tablespoons">tbsp</option>
                                <option value="teaspoons">tsp</option>
                                <option value="ounces">oz</option>
                                <option value="pounds">lbs</option>
                                <option value="grams">g</option>
                                {/* Add more measurement options here */}
                            </select>
                        <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddIngredient}>Add Ingredient</button>
                <br></br>
                <br></br>
                {instructions.map((instruction, index) => (
                    <div key={index}>
                        <textarea
                            value={instruction.description}
                            onChange={e => handleInstructionChange(index, e)}
                            placeholder="Instruction"
                        />
                        <button onClick={() => handleRemoveInstruction(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={handleAddInstruction}>Add Instruction</button>
                {/* Add a button here to submit the form */}
                <br></br>
                <button onClick={handleUpdateRecipe}>Update</button>
            </div>
        </div>
    );
}

export default EditRecipe;
