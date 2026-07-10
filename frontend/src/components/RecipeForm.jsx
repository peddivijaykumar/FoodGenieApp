import React, { useState } from "react";
import api from "../utils/api";
import Loader from "./layout/Loader";
import Message from "./Message";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredients.trim()) {
      setError("Please enter one or more ingredients.");
      return;
    }

    setError("");
    setRecipe("");
    setLoading(true);

    try {
      const { data } = await api.post("/recipe/generate", {
        ingredients,
      });

      setRecipe(data.recipe || "No recipe returned.");
    } catch (err) {
      setError(
        err.response?.data?.error || err.response?.data?.message || err.message || "Recipe generation failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="recipe-generator-card p-4 shadow-sm rounded">
        <h2 className="mb-3">AI Recipe Generator</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              className="form-control"
              rows="4"
              placeholder="e.g. chicken, garlic, lemon, spinach"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>

          {error && <Message variant="danger">{error}</Message>}

          <button type="submit" className="btn btn-primary">
            Generate Recipe
          </button>
        </form>

        <div className="mt-4">
          {loading && <Loader />}

          {!loading && recipe && (
            <div className="recipe-result p-3 rounded border bg-white">
              <h3>Your generated recipe</h3>
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {recipe}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
