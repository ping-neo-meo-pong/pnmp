import Head from 'next/head'
import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Link from "next/link";


export default function Home() {
	const router = useRouter();
	return (
		<div>
			<Link href="/login">
				<button> go to login </button>
			</Link>
		</div>
	);
}