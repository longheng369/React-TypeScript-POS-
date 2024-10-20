import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

const AddSale: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([{ name: '', email: '' }]);

  const handleAddForm = () => {
    setForms([...forms, { name: '', email: '' }]);
  };

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newForms = [...forms];
    newForms[index][event.target.name as keyof FormData] = event.target.value;
    setForms(newForms);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(forms);
    // Handle form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      {forms.map((form, index) => (
        <div key={index} style={{ marginBottom: '16px' }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange(index, e)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange(index, e)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddForm}>
        Add New Form
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddSale;
