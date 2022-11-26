import React from "react";

const User = ({ userInfo }) => {
  if (!userInfo || userInfo === {}) return <h1>UserInfo is Loading...</h1>;
  return (
    <header>
      <h4>
        NO.{userInfo.id} {userInfo.firstName}-{userInfo.lastName}{" "}
        {userInfo.isActive ? "(O)" : "(X)"}
      </h4>
    </header>
  );
};

export default User;
