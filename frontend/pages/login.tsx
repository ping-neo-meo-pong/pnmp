import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Link from "next/link";
import axios from 'axios';

let my_token;

export default function Login() {
	const router = useRouter();

	function onSubmitHandler(event) {
		event.preventDefault();
		console.log(event.target.username.value);
		// console.log(event.target);
		axios.post('/api/auth/login', {
			username: event.target.username.value,
			password: event.target.password.value
		}).then(function (response) {
			my_token = response.data.access_token;
			router.push("/");
			console.log(my_token);
		}).catch(function (error) {
			alert(error);
			console.log(error);
		});

	}
	return (
		<div>
			<form id="username" action="/api/auth/login" method="post"
				onSubmit={onSubmitHandler}>
				<input type="text" id="username" name="username" /><br />
				<input type="text" id="password" name="password" />
				<button type="submit">
					Login
				</button>
			</form>
			{/* <button onClick={onClickHandler}>로그인</button> */}
		</div>
	);
}