import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios';


export default function Home() {
	const [state, setState] = useState({
		firstName: null,
		lastName: null,
		birthdate: null,
		phone: null,
		email: null,
		picture: null,
		errorMessage: null,
	});

	function setField (name) {
		return function (event) {
			setState({
				...state,
				[name]: event.target.value,
			});
		}
	}

	async function genereateQr () {
		const {
			firstName,
			lastName,
			birthdate,
			phone,
			email,
		} = state;

		try {
			const resut = await axios.post('/api/qr', {
				firstName,
				lastName,
				birthdate,
				phone,
				email
			});
	
			setState({
				...state,
				picture: resut.data,
				errorMessage: null,
			});
		} catch (error) {
			setState({
				...state,
				errorMessage: error.response.data,
			});
		}
	}

	return (
	<div className="container">
		<Head>
			<title>Generate QR Code</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		first name
		<input name="firstName" onChange={setField('firstName')}/> <br/>
		last name
		<input name="lastName" onChange={setField('lastName')}/> <br/>
		phone
		<input name="phone" onChange={setField('phone')}/><br/>
		birthdate
		<input name="birthdate" type="date" onChange={setField('birthdate')}/><br/>
		email
		<input name="email" onChange={setField('email')}/><br/>
		<button type="button" onClick={genereateQr}> Submit</button>

		{state.picture && <img src={`data:image/jpeg;base64,${state.picture}`} />}

		{state.errorMessage}
	</div>
	)
}
