import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    email: '',
    password: '',
    bio: '',
    phone: '',  // Ensure phone is initially an empty string
    resume: null,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  console.log(formData.phone);  // Check the phone value for debugging

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        {formData.category === 'recruiter' && (
          <>
            <textarea
              placeholder="Bio (up to 250 words)"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div>
              <h3>Phone Number</h3>
              <PhoneInput
                country="au"
                value={formData.phone || ''}
                onChange={(phone) => setFormData({ ...formData, phone })}
                inputClass="w-full p-2 border rounded mb-6"
                placeholder="Phone Number"
              />
            </div>
            <div className="mb-6"></div>
          </>
        )}
        {formData.category === 'applicant' && (
          <>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
              className="w-full mb-4 p-2 border rounded"
            />
          </>
        )}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
