import React from 'react';
import "./Form.css";

const CategoryForm = ({
  catForm,
  setCatForm,
  catEditing,
  setCatEditing,
  categories,
  setCategories,
  handleSubmit,
}) => {
  return (
    <form
      className="category-form"
      onSubmit={(e) =>
        handleSubmit(e, catForm, catEditing, categories, setCategories, setCatForm, setCatEditing)
      }
    >
      <div className="form-group">
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

      <div className="form-group">
        <label htmlFor="catBudget">Budget Amount:</label>
        <p>Note: This number is for the entire monthly budget.</p>
        <input
          id="catBudget"
          type="number"
          placeholder="Budget"
          value={catForm.budget}
          onChange={(e) => setCatForm({ ...catForm, budget: e.target.value })}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-actions">
        <button className="action-btn primary" type="submit">
          {catEditing ? 'Update' : 'Add'} Category
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
