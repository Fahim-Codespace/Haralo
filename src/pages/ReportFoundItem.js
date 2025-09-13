import React, { useState } from 'react';
import '../css/ReportLostItem.css';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

function ReportFoundItem() {
  const [form, setForm] = useState({
    name: '',
    item: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });

    try {
      const res = await fetch('http://localhost:5000/api/report-found', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Item reported successfully!');
        setForm({
          name: '',
          item: '',
          location: '',
          date: '',
          description: '',
          contact: '',
          photo: null,
        });
      } else {
        alert('Error reporting item.');
      }
    } catch (err) {
      alert('Server error.');
    }
  };

  return (
    <div>
      <Navigation />
      <div className='report-lost-item'>
        <div className="form-container">
          <h2 className="form-title">
            <span className="red">Report</span> <span className="green">Found Item</span>
          </h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>Name :</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />

            <label>Item :</label>
            <input type="text" name="item" value={form.item} onChange={handleChange} />

            <label>Location :</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} />

            <label>Date :</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />


      <label>Item Description :</label>
      <textarea name="description" value={form.description} onChange={handleChange}></textarea>

      <label>Contact Info :</label>
      <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Enter your phone, email, etc." required />

            <label>Upload Photo :</label>
            <input type="file" name="photo" onChange={handleChange} />
            <small>(Upload if available)</small>

            <div className="button-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="reset" className="reset-btn" onClick={() => setForm({ name: '', item: '', location: '', date: '', description: '', contact: '', photo: null })}>Reset</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReportFoundItem;
