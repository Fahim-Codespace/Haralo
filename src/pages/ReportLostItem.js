import React from 'react';
import '../css/ReportLostItem.css';
import Navigation from '../components/navigation';
import Footer from '../components/footer';

function ReportLostItem(){
  return (
    <div>
        <Navigation />
     <div className='report-lost-item'>
     <div className="form-container">
      <h2 className="form-title">
        <span className="red">Report</span> <span className="green">Lost Item</span>
      </h2>

      <form className="form">
        <label>Name :</label>
        <input type="text" name="name" />

        <label>Item :</label>
        <select name="item">
          <option>Select Item</option>
        </select>

        <label>Location :</label>
        <select name="location">
          <option>Select Location</option>
        </select>

        <label>Date :</label>
        <input type="date" name="date" />

        <label>Item Description :</label>
        <textarea name="description"></textarea>

        <label>Upload Photo :</label>
        <input type="file" name="photo" />
        <small>(Upload if available)</small>

        <div className="button-group">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="reset" className="reset-btn">Reset</button>
        </div>
      </form>
    </div>
    </div>
          <Footer />
    </div>
  );
};

export default ReportLostItem;
