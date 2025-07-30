import React from 'react';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import '../css/AboutUs.css';

const teamMembers = [
  { name: 'Jaliz Mahamud Mridul', img: '/images/mridul.jpg' },
  { name: 'Md. Fahim Imam', img: '/images/fahim.jpg' },
  { name: 'Shahriar Mahir', img: '/images/mahir.jpg' },
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
          <p>Our goal is to create a platform that connects people who have lost items with those who have found them, making it easier to reunite lost belongings with their owners.
          We aim to foster a community of trust and support, where individuals can help each other in times of need, ensuring that lost items find their way back home.
          Through our platform, we strive to reduce the stress and frustration associated with losing personal belongings, providing a simple and effective solution for both finders and owners.
          We believe in the power of community and aim to build a network where everyone can contribute to helping others, making the world a little bit better, one lost item at a time.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;

