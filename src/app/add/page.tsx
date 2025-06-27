'use client'

import { Box, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, ListItemText, ListSubheader, TextField, Typography } from '@mui/material';
import JSZip from 'jszip';
import React, { ChangeEvent, useState } from 'react'

interface IItem {
	id: string;
	name: string;
	category: string;
	quantity: number;
	serial_numbers: string[];
	estimated_value: number;
	initial_value: number;
	notes: string;
	images: File[];
}

type NewItemFormState = {
    name: string;
    category: string;
    quantity: number | string;
    serial_numbers: string[];
    estimated_value: number | string;
    initial_value: number | string;
    notes: string;
    images: FileList | null;
}

const AddPage = () => {
	const [items, setItems] = useState<IItem[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const initialItemState: NewItemFormState = {
		name: '',
		category: '',
		quantity: 1,
		serial_numbers: [],
		estimated_value: 0,
		initial_value: 0,
		notes: '',
		images: null,
	};

	const [newItem, setNewItem] = useState<NewItemFormState>(initialItemState);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.files) {
            setNewItem({ ...newItem, images: e.target.files });
            return;
        }

        // For number inputs, only update if the value is a valid number format or empty
        if (type === 'number' && value !== '' && !/^\d*\.?\d*$/.test(value)) {
           return; // Prevents invalid characters in number fields
        }

        setNewItem({
            ...newItem,
            [name]: value,
        });
    };

	const handleAddItem = () => {
        if (!newItem.name) return;

        const itemToAdd: IItem = {
            id: `${Date.now()}-${newItem.name}`, // Assign a unique ID
            name: newItem.name,
            category: newItem.category,
            quantity: Number(newItem.quantity) || 0,
            serial_numbers: newItem.serial_numbers,
            estimated_value: Number(newItem.estimated_value) || 0,
            initial_value: Number(newItem.initial_value) || 0,
            notes: newItem.notes,
            images: newItem.images ? Array.from(newItem.images) : [],
        };

        setItems(prevItems => [...prevItems, itemToAdd]);
        setNewItem(initialItemState); // Reset form using the initial state constant
        setDialogOpen(false);
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

            const textContent = `name: ${item.name}\ncategory: ${item.category}\nquantity: ${item.quantity}\ninitial_value: $${item.initial_value}\nestimated_value: $${item.estimated_value}\nnotes: ${item.notes}`;

            folder?.file('info.txt', textContent);

            item.images.forEach((image, imgIndex) => {
                const ext = image.name.slice(image.name.lastIndexOf('.')) || '.jpg';
                folder?.file(`image_${imgIndex + 1}${ext}`, image);
            });
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'items.zip';
        document.body.appendChild(link);
        link.click();

        // Clean up by revoking the object URL and removing the link
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

	return (
		<Container maxWidth='sm' sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
			<Card sx={{minWidth:'20rem', bgcolor:'custom.standard.2', borderRadius:2}}>
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
				<DialogTitle>Add New Item</DialogTitle>
				<DialogContent dividers>
					<TextField
						label="Name"
						name='name'
						value={newItem.name}
						onChange={handleChange}
						fullWidth
						margin='dense'
					/>
					<TextField
						label="Category"
						name='category'
						value={newItem.category}
						onChange={handleChange}
						fullWidth
						margin='dense'
					/>
					<TextField
						label="Initial Value"
						name='initial_value'
						type="number"
						value={newItem.initial_value}
						onChange={handleChange}
						fullWidth
						margin='dense'
					/>
					<TextField
						label="Estimated Value"
						name='estimated_value'
						type="number"
						value={newItem.estimated_value}
						onChange={handleChange}
						fullWidth
						margin='dense'
					/>
					<TextField
						label="Quantity"
						name='quantity'
						type="number"
						value={newItem.quantity}
						onChange={handleChange}
						fullWidth
						margin='dense'
					/>
					<TextField
						label="Notes"
						name='notes'
						value={newItem.notes}
						onChange={handleChange}
						fullWidth
						margin="dense"
						multiline
						rows={3}
					/>
					<Box mt={2}>
						<input
							type="file"
							name='images'
							multiple
							accept="image/*"
							onChange={handleChange}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" onClick={handleAddItem}>Add</Button>
				</DialogActions>
				</Dialog>
			</Card>
		</Container>
	)
}

export default AddPage