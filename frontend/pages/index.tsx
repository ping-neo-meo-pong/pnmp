import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';

export default function Home() {
	return (
		<div>
			<form id="username" action="/api/auth/login" method="post">
				<input type="text" name="username" /><br />
				<input type="text" name="password" />
				<button type="submit">
					Login
				</button>
			</form>
		</div>
	);
}