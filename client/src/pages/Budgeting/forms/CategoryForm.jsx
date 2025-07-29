import React from 'react';
import "./CategoryForm.css";

const CategoryForm = ({ catForm, setCatForm, catEditing, setCatEditing, categories, setCategories, handleSubmit }) => {
  return (
    <form
      className="category-form"
      onSubmit={(e) =>
        handleSubmit(e, catForm, catEditing, categories, setCategories, setCatForm, setCatEditing)
      }
    >
      <h3>{catEditing ? 'Edit' : 'Add'} Category</h3>
      <div className="form-row">
        <label htmlFor="catName">Name:</label>
        <input
          id="catName"
          type="text"
          placeholder="Category Name"
          value={catForm.name}
          onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="catBudget">Budget:</label>
        <input
          id="catBudget"
          type="number"
          placeholder="Budget"
          value={catForm.budget}
          onChange={(e) => setCatForm({ ...catForm, budget: e.target.value })}
          required
        />
      </div>
      <button className="submit-btn" type="submit">
        {catEditing ? 'Update' : 'Add'} Category
      </button>
    </form>
  );
};

export default CategoryForm;