import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "../user/User";

const UserPage = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    await axios
      .get(`http://localhost/api/users`)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log("실패");
        console.log(error.response);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {users.map((user) => (
        <User userInfo={user} key={user.id} />
      ))}
    </>
  );
};

export default UserPage;
