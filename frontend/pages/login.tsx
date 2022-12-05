import Head from "next/head";
import Image from "next/image";
// import styles from '../styles/Home.module.css'
import React, { FormEvent, SyntheticEvent } from "react";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { io, Socket } from "socket.io-client";

export let user_data: any = {
  _name: "",
  _pass: "",
  _socket: "",
  _token: "",
  _room: [],
  is_player: 0,
};

export let socket: Socket;

function initSocketConnection() {
  socket = io({ transports: ["websocket"] });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  socket.emit("authorize", user_data._token);
}

export default function Login() {
  const router = useRouter();

  async function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    user_data._name = event.currentTarget.username.value;
    console.log(event.currentTarget.username.value);
    await axios
      .post(
        "/server/api/auth/login",
        {
          username: event.currentTarget.username.value,
          password: event.currentTarget.password.value,
        },
        { withCredentials: true }
      )
      .then(function (response) {
        user_data._token = response.data.accessToken;
        user_data._id = response.data.id;
        console.log(user_data._id);
        // user_data._pass = event.currentTarget.password.value;
        initSocketConnection();
        router.push("/clients");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input type="text" id="username" name="username" />
        <br />
        <input type="text" id="password" name="password" />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
