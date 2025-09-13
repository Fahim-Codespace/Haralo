import React, { useState } from 'react';
import '../css/ReportLostItem.css';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

import axios from 'axios';

function ReportLostItem(){
  const [formData, setFormData] = useState({
    name: '',
    item: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    photo: null
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value ?? '');
      });
      const res = await axios.post('http://localhost:5000/api/report-lost', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(res.data.message);
      if (res.status === 201) {
  setFormData({ name: '', item: '', location: '', date: '', description: '', contact: '', photo: null });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div>
      <Navigation />
      <div className='report-lost-item'>
        <div className="form-container">
          <h2 className="form-title">
            <span className="red">Report</span> <span className="green">Lost Item</span>
          </h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>Name :</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <label>Item :</label>
            <input type="text" name="item" value={formData.item} onChange={handleChange} required />
            <label>Location :</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            <label>Date :</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <label>Item Description :</label>
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

            <label>Contact Info :</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter your phone, email, etc." required />
            <label>Upload Photo :</label>
            <input type="file" name="photo" onChange={handleChange} />
            <small>(Upload if available)</small>
            <div className="button-group">
              <button type="submit" className="submit-btn">Submit</button>
              <button type="reset" className="reset-btn" onClick={() => setFormData({ name: '', item: '', location: '', date: '', description: '', contact: '', photo: null })}>Reset</button>
            </div>
          </form>
          {message && <p style={{ marginTop: '16px' }}>{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReportLostItem;
