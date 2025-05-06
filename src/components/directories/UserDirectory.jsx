import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../config';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);

  // Sample data (this could be fetched from your backend)
  useEffect(() => {
    const fetchData = async () => {
      // Simulating fetching from a backend API
      const resposne = await axios.get(`${config.baseURL}/api/users`);
      setUsers(resposne.data.filter(user=>user.role!=='driver'));
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 mt-12">
      <h1 className="text-3xl font-extrabold text-left text-gray-800 mb-8">
        User Information
      </h1>
      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-gray-400 to-slate-300 text-white">
              <th className="py-3 px-6 font-semibold text-left">Name</th>
              <th className="py-3 px-6 font-semibold text-left">User ID</th>
              <th className="py-3 px-6 font-semibold text-left">Address</th>
              <th className="py-3 px-6 font-semibold text-left">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-6 border-b border-gray-200">{user.name}</td>
                <td className="py-3 px-6 border-b border-gray-200">{user.userID}</td>
                <td className="py-3 px-6 border-b border-gray-200">{user.address}</td>
                <td className="py-3 px-6 border-b border-gray-200">{user.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDirectory;
