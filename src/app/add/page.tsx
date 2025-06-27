'use client'

import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, ListSubheader, MenuItem, TextField, Typography } from '@mui/material';
import JSZip from 'jszip';
import Image from 'next/image';
import React, { FormEvent, useRef, useState } from 'react'

interface IItem {
	id: string;
	name: string;
	user: string;
	category: string;
	quantity: number;
	serial_numbers: string[];
	estimated_value: number;
	initial_value: number;
	value_link: string;
	notes: string;
	images: File[];
}

const AddPage = () => {
	// User Management
	const [user, setUser] = useState('');
	const [hasUser, setHasUser] = useState(false);

	const [items, setItems] = useState<IItem[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	// Image Selection
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.currentTarget); // Get form data

        const name = formData.get('name') as string;
        if (!name) return; // Don't add item if name is missing

        const itemToAdd: IItem = {
            id: `${Date.now()}-${name}`,
            name: name,
			user: user,
            category: formData.get('category') as string || 'N/A',
            quantity: Number(formData.get('quantity')) || 0,
            serial_numbers: (formData.get('serial_numbers') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
            initial_value: Number(formData.get('initial_value')) || 0,
            estimated_value: Number(formData.get('estimated_value')) || 0,
            value_link: formData.get('value_link') as string || '',
            notes: formData.get('notes') as string || '',
            images: selectedImages,
        };

        setItems(prevItems => [...prevItems, itemToAdd]);
        setDialogOpen(false); // Close the dialog after adding
    };

	const handleDeleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

	const handleClearItems = () => {
        setItems([]);
    };

	const handleDownloadZip = async () => {
        const zip = new JSZip();

        items.forEach((item, index) => {
            const folderName = `${index + 1}_${item.name.replace(/\s+/g, '_')}`;
            const folder = zip.folder(folderName);

            const textContent = `id: ${item.id}\nname: ${item.name}\nuser: ${item.user}\ncategory: ${item.category}\nquantity: ${item.quantity}\nserial_numbers: ${item.serial_numbers.join(', ')}\ninitial_value: $${item.initial_value}\nestimated_value: $${item.estimated_value}\nvalue_link: $${item.value_link}\nnotes: ${item.notes}`;

            folder?.file('info.txt', textContent);

			const metadata = {
				...item,
				images: item.images.map((img, i) => `image_${i + 1}_${item.name.replace(/\s+/g, '_')}`),
			};
			folder?.file('data.json', JSON.stringify(metadata, null, 4));

			item.images.forEach((image, imgIndex) => {
				folder?.file(`image_${imgIndex + 1}_${item.name.replace(/\s+/g, '_')}.jpg`, image);
			});
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `items_${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL and removing the link
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

	return (
		<Container maxWidth='sm' sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
			<Grid container direction={'column'} spacing={2}>
				<Grid>
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
									onChange={(e) => {setUser(e.target.value as string); setHasUser(true)}}
									fullWidth
									size='small'
								>
									<MenuItem value={'guillermo'}>Paps</MenuItem>
									<MenuItem value={'sofia'}>Mams</MenuItem>
									<MenuItem value={'guillermo_jr'}>Guillo</MenuItem>
									<MenuItem value={'pablo'}>Pablo</MenuItem>
									<MenuItem value={'alvaro'}>Álvaro</MenuItem>
									<MenuItem value={'diego'}>Diego</MenuItem>
								</TextField>
							</Grid>
						</Grid>
					</Card>
				</Grid>
				<Grid>
					<Card sx={{minWidth:'20rem', height:'100%', bgcolor:'custom.standard.2', borderRadius:2, pointerEvents: hasUser ? 'initial' : 'none', opacity: hasUser ? 1 : 0.5}}>
						<Grid container direction={'column'} spacing={2}>
							<Grid>
								<Box sx={{textAlign:'center'}}>
									<Typography variant="h2" noWrap>Add Items</Typography>
								</Box>
							</Grid>
							<Grid sx={{display:'flex', justifyContent:'space-between'}}>
								<Button onClick={handleClearItems} disabled={items.length === 0} variant='contained' color='error'>Clear Items</Button>
								<Button onClick={() => setDialogOpen(true)} variant='contained'>Add New Item</Button>
							</Grid>
							<Grid>
								<List subheader={<ListSubheader sx={{bgcolor:'custom.standard.2'}}>Items</ListSubheader>} sx={{border:'1px solid gray', borderRadius:1, padding:0}}>
									{items.map((item, index) => (
										<ListItem key={index} secondaryAction={<Button variant='outlined' color="error" onClick={() => handleDeleteItem(item.id)} sx={{width:'1rem', padding:1}}>X</Button>}>
											<ListItemText
												primary={`${item.name} (${item.category}) x${item.quantity}`}
												secondary={`Initial: $${item.initial_value} | Est: $${item.estimated_value}`}
											/>
										</ListItem>
									))}
								</List>
							</Grid>
							{items.length > 0 && (
								<Grid>
									<Button variant="outlined" onClick={handleDownloadZip} fullWidth>Download All Items</Button>
								</Grid>
							)}
						</Grid>

						{/* Dialog for adding item */}
						<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
							<form id="add-item-form" onSubmit={handleSubmit}>
								<DialogTitle>Add New Item</DialogTitle>
								<DialogContent dividers>
									<TextField name='name' label="Name" fullWidth margin='dense' size='small'/>
									<TextField name='category' label="Category" fullWidth margin='dense' size='small' select defaultValue={''}>
										<MenuItem value={'electronicos'}>electronicos</MenuItem>
										<MenuItem value={'muebles'}>Muebles</MenuItem>
										<MenuItem value={'joyeria'}>Joyería</MenuItem>
										<MenuItem value={'ropa'}>Ropa</MenuItem>
										<MenuItem value={'ropa'}>Ropa</MenuItem>
									</TextField>
									<TextField name='quantity' label="Quantity" type="number" fullWidth margin='dense' size='small' defaultValue={1}/>
									<TextField name='serial_numbers' label='Serial Numbers (x,y)' fullWidth margin='dense' size='small'/>
									<Box sx={{display:'flex', gap:1}}>
										<TextField name='initial_value' label="Initial Value" type="number" fullWidth margin='dense' size='small'/>
										<TextField name='estimated_value' label="Estimated Value" type="number" fullWidth margin='dense' size='small'/>
									</Box>
									<TextField name='value_link' label="Value Link" fullWidth margin='dense' size='small'/>
									<TextField name='notes' label="Notes" fullWidth margin="dense" multiline rows={3} size='small'/>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										capture="environment"
										style={{ display: 'none' }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
											setSelectedImages((prev) => [...prev, file]);
											}
											e.target.value = ''; // Reset so user can take the same photo again if needed
										}}
									/>
									<Button onClick={() => fileInputRef.current?.click()} variant="outlined" sx={{mt:1}}>
										Take Picture
									</Button>
									<Box display="flex" flexWrap="wrap" gap={1} mt={2}>
										{selectedImages.map((file, i) => (
											<Image
												key={i}
												src={URL.createObjectURL(file)}
												alt={`Preview ${i}`}
												width={50}
												height={50}
												objectFit='cover'
											/>
										))}
									</Box>
								</DialogContent>
								<DialogActions>
									<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
									<Button variant="contained" type='submit' form="add-item-form">Add</Button>
								</DialogActions>
							</form>
						</Dialog>
					</Card>
				</Grid>
			</Grid>
		</Container>
	)
}

export default AddPage