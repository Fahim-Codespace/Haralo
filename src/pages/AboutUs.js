import React, { useEffect, useState } from 'react';
import { get, put, post } from '../utils/requests';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/navigation';
import Footer from '../components/footer';
import '../css/AboutUs.css';
import api from '../utils/api';

const teamMembers = [
  { name: 'Jaliz Mahamud Mridul', img: '/images/mridul.jpg' },
  { name: 'Md. Fahim Imam', img: '/images/fahim.jpg' },
  { name: 'Shahriar Mahir', img: '/images/mahir.jpg' },
];

function AboutUs() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await post('/api/student/signup', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res && res.status >= 200 && res.status < 300) navigate('/login');
      else alert(res?.data?.message || 'Signup failed');
    } catch (err) {
      console.error('Signup error', err);
      alert(err?.response?.data?.message || err.message || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get('/api/about'); // adjust endpoint if backend differs
        if (res && res.status === 200) setData(res.data);
      } catch (err) {
        console.error('About fetch', err);
      }
    };
    load();
  }, []);

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
            Our goal is to create a platform that connects people who have lost
            items with those who have found them, making it easier to reunite lost
            belongings with their owners. We aim to foster a community of trust
            and support, where individuals can help each other in times of need,
            ensuring that lost items find their way back home. Through our
            platform, we strive to reduce the stress and frustration associated
            with losing personal belongings, providing a simple and effective
            solution for both finders and owners. We believe in the power of
            community and aim to build a network where everyone can contribute to
            helping others, making the world a little bit better, one lost item
            at a time.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await get('/api/student/profile');
        if (res && res.status === 200) {
          setProfile(res.data);
          setUpdateData({ name: res.data.name || '', email: res.data.email || '' });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await put('/api/student/profile', updateData);
      if (res && res.status >= 200 && res.status < 300) {
        alert('Profile updated');
      } else {
        alert(res?.data?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Server error');
    }
  };

  return (
    <div>
      <Navigation />
      <div className="profile">
        <h1>Profile</h1>
        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <form onSubmit={handleUpdate}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={updateData.name}
                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={updateData.email}
                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                required
              />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        ) : (
          <p>Profile not found</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
export { Profile };

