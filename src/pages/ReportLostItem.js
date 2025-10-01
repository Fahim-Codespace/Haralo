import React, { useState } from 'react';
import '../css/ReportLostItem.css';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import { post } from '../utils/requests';

function ReportLostItem() {
  const [form, setForm] = useState({
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
    try {
      const uploadForm = new FormData();
      if (form.photo) uploadForm.append('photo', form.photo);
      let photoUrl = '';
      if (form.photo) {
        const up = await post('/api/uploads/gridfs/upload', uploadForm, { headers: { 'Content-Type': 'multipart/form-data' } });
        photoUrl = up.data?.fileUrl || '';
      }
      const payload = { item: form.item, location: form.location, date: form.date, description: form.description, contact: form.contact, photo: photoUrl };
      const res = await post('/api/report-lost', payload);
      if (res && res.status >= 200 && res.status < 300) { alert('Reported'); setForm({ item: '', location: '', date: '', description: '', contact: '', photo: null }); }
      else alert(res?.data?.message || 'Report failed');
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Server error'); }
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
              <button type="button" className="reset-btn" onClick={() => setForm({ item: '', location: '', date: '', description: '', contact: '', photo: null })}>Reset</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ReportLostItem;
