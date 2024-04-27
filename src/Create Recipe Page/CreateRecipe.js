import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import './CreateRecipe.css';

const CreateRecipe = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredient: '', amount: '', measurement: '' },]); // State for ingredient objects
    const [instructions, setInstructions] = useState(['']);  // State for instructions as an array of strings
    // const [instructions, setInstructions] = useState([{instruction: ''},]);  // State for instructions as an array of strings
    const [isInstruction, setIsInstruction] = useState(false);   // Tracks whether user is adding an instruction
    
    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index][event.target.name] = event.target.value;
        setIngredients(newIngredients);
    };

    const handleInstructionChange = (index, event) => {
        const newInstructions = [...instructions];
        newInstructions[index] = event.target.value;
        setInstructions(newInstructions);
    };
    
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient: '', amount: '', measurement: '' }]);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleRemoveIngredient = (index)  => {
        if (ingredients.length > 1) {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
        }
    };

    const handleRemoveInstruction = (index) => {
        if(instructions.length > 1) {
            const newInstructions = [...instructions];
            newInstructions.splice(index, 1);
            setInstructions(newInstructions);
        }
    };

    const handleRecipeNameChange = (event) => {
        setRecipeName(event.target.value);
    };

    const handleNext = () => {
        setIsInstruction(true);
    };

    const handleBack = () => {
        setIsInstruction(false);
    };

    const handleFinish = () => {
        const recipeData = {
            ingredients,
            instructions,
            recipeName
        };
    
        fetch('/createRecipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        })
        .then(response => {
            if (response.ok) {
                // Request was successful, update the database
                console.log('Recipe data sent to server');
            } else {
                // Request failed, handle the error
                console.error('Failed to send recipe data to server');
            }
        })
        .then(() => {
            alert("Recipe created successfully!");
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error sending recipe data to server:', error);
        });
    };

    return(
        <div className="create-recipe">
            <Navbar />
            <div className="create-recipe-container">
                <h1>Create Recipe</h1>
                <h2><input name="recipeName" value={recipeName} onChange={handleRecipeNameChange}
                        placeholder="Recipe Name" /></h2>
                {!isInstruction ? (
                    ingredients.map((ingredient, index) => (
                        <div key={index}>
                            <input name="ingredient" value={ingredient.ingredient} onChange={(e) => handleIngredientChange(index, e)}
                                placeholder="Ingredient"
                            />
                            <input
                                type="number"
                                name="amount"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, e)}
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
                            <button onClick={()=>handleRemoveIngredient(index)}>Remove</button>
                        </div>
                    ))
                ) : (
                    instructions.map((instruction, index) => (
                        <div key={index}>
                            <textarea value={instruction} onChange={(e) => handleInstructionChange(index, e)} placeholder="Instruction" />
                            <button onClick={()=>handleRemoveInstruction(index)}>Remove</button>
                        </div>
                    ))
                )}
                <button onClick={isInstruction ? handleAddInstruction : handleAddIngredient}>Add {isInstruction ? 'Instruction' : 'Ingredient'}</button>
                <div className="navigation-buttons">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={isInstruction ? handleFinish : handleNext}>
                        {isInstruction ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateRecipe;