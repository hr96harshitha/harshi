import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [ingredient, setIngredient] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Add ingredient
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

  // Calculate expiry days
  const calculateDays = (date) => {
    const today = new Date();
    const expiryDate = new Date(date);

    const diffTime = expiryDate - today;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get recipes
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

      // If recipes found
      if (response.data.length > 0) {
        setRecipes(response.data);
      } else {
        // Fallback recipes
        setRecipes([
          {
            id: 1,
            title: "Vegetable Salad",
            image:
              "https://images.unsplash.com/photo-1546793665-c74683f339c1"
          },
          {
            id: 2,
            title: "Tomato Pasta",
            image:
              "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9"
          }
        ]);
      }
    } catch (error) {
      console.log(error);

      // Backup recipes if API fails
      setRecipes([
        {
          id: 1,
          title: "Fried Rice",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b"
        },
        {
          id: 2,
          title: "Veg Sandwich",
          image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af"
        },
        {
          id: 3,
          title: "Mixed Veg Curry",
          image:
            "https://images.unsplash.com/photo-1604908176997-4319d6aee8b1"
        }
      ]);
    }
  };

  return (
    <div className="container">
      <h1>🥗 Zero-Waste Fridge Manager</h1>

      {/* Input Section */}
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

      {/* Ingredient List */}
      <div className="ingredient-list">
        {ingredients.map((item, index) => (
          <div className="ingredient-card" key={index}>
            <h3>{item.name}</h3>

            <p>
              ⏳ Expires in {calculateDays(item.expiry)} day(s)
            </p>
          </div>
        ))}
      </div>

      {/* Recipe Button */}
      <button className="recipe-btn" onClick={getRecipes}>
        Find Recipes
      </button>

      {/* Recipe Section */}
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