import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function SaveDialogForm(props) {

    const [openSaveDialog, setOpenSaveDialog] = useState(false);
    const [saveName, setSaveName] = useState("")
    const [loadableItems, setLoadableItems] = useState(props.loadableItems);

    const handleClickOpenSaveDialog = () => {
        setOpenSaveDialog(true);
    };

    const handleCloseSaveDialog = () => {
        setOpenSaveDialog(false);
    };

    const handleCloseSaveDialogWithSave = (callback) => {
        callback(saveName)
        setOpenSaveDialog(false);
        if (!loadableItems.includes(saveName)) {
            setLoadableItems([...loadableItems, saveName])
        }
    };

    const setSaveNameForm = (saveName) => {
        setSaveName(saveName)
    }

    const deleteSave = (saveName) => {
        props.deleteCallback(saveName)
        setLoadableItems(loadableItems.filter(e => e !== saveName))
    }

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpenSaveDialog}>
                Save
            </Button>
            <Dialog open={openSaveDialog} onClose={handleCloseSaveDialog}>
                <DialogTitle>{`Save Progress: ${saveName}`}</DialogTitle>
                <DialogContent>
                    <List>
                        {loadableItems.map((val, index) => (
                            <ListItem key={index} disablePadding>
                                <IconButton onClick={() => deleteSave(val)} edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                                <ListItemButton onClick={(e) => setSaveNameForm(e.target.textContent)}>
                                    <ListItemText primary={val} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Save"
                        fullWidth
                        variant="standard"
                        onBlur={(e) => setSaveNameForm(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSaveDialog}>Cancel</Button>
                    <Button onClick={() => handleCloseSaveDialogWithSave(props.callback)}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
} export default SaveDialogForm;