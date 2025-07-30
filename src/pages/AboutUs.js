import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import '../css/AboutUs.css';

const teamMembers = [
  { name: 'Mridul', img: '/images/mridul.jpg' },
  { name: 'Fahim', img: '/images/fahim.jpg' },
  { name: 'Mahir', img: '/images/mahir.jpg' },
];

function AboutUs() {
  return (
    <div>
      <Navigation />
      <div className="aboutus">
        <h1 className="aboutus-title">About Us</h1>
        <div className="team">
          {teamMembers.map((member, idx) => (
            <div className="team-member" key={idx}>
              <img src={member.img} alt={member.name} className="team-img" />
              <div className="team-name">{member.name}</div>
            </div>
          ))}
        </div>
        <div className="goal">
          <h2>Our Goals</h2>
          <p>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;

