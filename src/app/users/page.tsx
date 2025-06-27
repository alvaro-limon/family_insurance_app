'use client'

import { Box, Button, Card, Container, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UsersPage() {
	const router = useRouter();

	const [user, setUser] = useState('');
	const [isComplete, setIsComplete] = useState(false);

	return (
		<Container maxWidth='sm' sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
			<Card sx={{minWidth:'20rem', bgcolor:'custom.standard.2', borderRadius:2}}>
				<Grid container direction={'column'} spacing={2}>
					<Grid>
						<Box sx={{textAlign:'center'}}>
							<Typography variant="h2" noWrap>Who are you?</Typography>
						</Box>
					</Grid>
					<Grid>
						<TextField
							select
							id="select-user"
							value={user}
							label="User"
							onChange={(e) => {setUser(e.target.value as string); setIsComplete(true)}}
							fullWidth
						>
							<MenuItem value={'guillermo'}>Paps</MenuItem>
							<MenuItem value={'sofia'}>Mams</MenuItem>
							<MenuItem value={'guillermo_jr'}>Guillo</MenuItem>
							<MenuItem value={'pablo'}>Pablo</MenuItem>
							<MenuItem value={'alvaro'}>Álvaro</MenuItem>
							<MenuItem value={'diego'}>Diego</MenuItem>
						</TextField>
					</Grid>
					<Grid>
						<Button variant="contained" fullWidth disabled={!isComplete} onClick={() => router.push('/add')}>Next</Button>
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}
