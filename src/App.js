import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [ingredient, setIngredient] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const addIngredient = () => {
    if (!ingredient || !expiry) {
      alert("Please fill all fields");
      return;
    }

    const newIngredient = {
      name: ingredient,
      expiry: expiry
    };

    setIngredients([...ingredients, newIngredient]);

    setIngredient("");
    setExpiry("");
  };

  const getRecipes = async () => {
    const ingredientList = ingredients.map((item) => item.name);

    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        {
          params: {
            ingredients: ingredientList.join(","),
            number: 5,
            apiKey: process.env.REACT_APP_API_KEY
          }
        }
      );

      setRecipes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDays = (date) => {
    const today = new Date();
    const expiryDate = new Date(date);

    const diffTime = expiryDate - today;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container">
      <h1>🥗 Zero-Waste Fridge Manager</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter ingredient"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        />

        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />

        <button onClick={addIngredient}>Add</button>
      </div>

      <div className="ingredient-list">
        {ingredients.map((item, index) => (
          <div className="ingredient-card" key={index}>
            <h3>{item.name}</h3>
            <p>⏳ Expires in {calculateDays(item.expiry)} day(s)</p>
          </div>
        ))}
      </div>

      <button className="recipe-btn" onClick={getRecipes}>
        Find Recipes
      </button>

      <div className="recipes">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;