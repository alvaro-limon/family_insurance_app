'use client'

import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	return (
		<Container maxWidth='sm' sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
			<Card sx={{minWidth:'20rem', bgcolor:'custom.standard.2', borderRadius:2}}>
				<Grid container direction={'column'} spacing={2}>
					<Grid>
						<Box sx={{textAlign:'center'}}>
							<Typography variant="h2" noWrap>Insurance App</Typography>
						</Box>
					</Grid>
					<Grid>
						<Button variant="contained" fullWidth onClick={() => router.push('/users')}>Start</Button>
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}
