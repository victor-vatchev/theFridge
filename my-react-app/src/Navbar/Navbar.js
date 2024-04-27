import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Nav.css'; // Import style sheet

const Navbar = () => {
return (
<nav className="navbar">
    <div className="container">
        <Link to="/" className="navbar-title">the<span>Fridge</span></Link>
        <ul className="nav-buttons">
            <li>
                <Link to="/CreateRecipe">Save A Recipe</Link>
            </li>
            <li>
                <Link to="/EditOrDelete">Edit/Delete Recipe</Link>
            </li>
            <li>
                <Link to="/FindRecipe">Find A Recipe</Link>
            </li>
        </ul>
    </div>
</nav>
);
};

export default Navbar;