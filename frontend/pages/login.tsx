import Head from "next/head";
import Image from "next/image";
// import styles from '../styles/Home.module.css'
import React, { FormEvent, SyntheticEvent } from "react";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Socket } from "socket.io-client";

export let user_data: any = {
  _name: "",
  _pass: "",
  _socket: "",
  _token: "",
  _room: [],
};

export default function Login() {
  const router = useRouter();

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("hi");
    console.log(event.currentTarget.username.value);
    await axios
      .post("/api/auth/login", {
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
      })
      .then(function (response) {
        router.push("/clients");
        console.log(response);
        user_data._token = response.data.accessToken;
        user_data._name = response.data.userName;
        // user_data._pass = event.currentTarget.password.value;
        console.log(user_data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input type="text" id="username" name="username" /><br />
        <input type="text" id="password" name="password" /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
