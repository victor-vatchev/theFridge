import React from 'react';
import Navbar from "../Navbar/Navbar"; // Import the Navbar component
import { Link } from 'react-router-dom'; // Import Link for navigation
import './WelcomePage.css'; // Import style sheet


const WelcomePage = () => {
    return (
        <div className="welcome-page">
            <Navbar /> {/* Render the Navbar component */}
            <div className="welcome-message">
                <h1>Welcome!</h1>
                <p>This is theFridge, your personal recipe manager. 
                    Input your favorite recipes, and they'll be saved here!
                    Once you have saved recipes, you can find them here, along with 
                    if you have specific ingredients that you are curious if 
                    they can be used for a recipe you've already saved.
                </p>
                <div className='button-container'>
                    <Link to="/CreateRecipe">Save A Recipe</Link>
                    <Link to="/FindRecipe">Find A Recipe</Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;