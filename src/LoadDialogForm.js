import React, { useState } from 'react';
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

function LoadDialogForm(props) {

    const [openLoadDialog, setOpenLoadDialog] = useState(false);
    const [loadName, setLoadName] = useState("")
    const [loadableItems, setLoadableItems] = useState(props.loadableItems);

    const handleClickOpenLoadDialog = () => {
        setOpenLoadDialog(true);
    };

    const handleCloseLoadDialog = () => {
        setOpenLoadDialog(false);
    };

    const setLoadNameDialog = (e) => {
        setLoadName(e.target.textContent)
    }

    const handleCloseLoadDialogWithCallback = (callback) => {
        callback(loadName)
        setOpenLoadDialog(false);
    };

    const deleteSave = (saveName) => {
        props.deleteCallback(saveName)
        setLoadableItems(loadableItems.filter(e => e !== saveName))
    }

    return (
        <>
            <Button variant="outlined" onClick={handleClickOpenLoadDialog}>
                Load
            </Button>
            <Dialog open={openLoadDialog} onClose={handleCloseLoadDialog}>
                <DialogTitle>{`Load: ${loadName}`}</DialogTitle>
                <DialogContent>
                    <List>
                        {loadableItems.map((val, index) => (
                            <ListItem key={index} disablePadding>
                                <IconButton onClick={() => deleteSave(val)} edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                                <ListItemButton onClick={setLoadNameDialog}>
                                    <ListItemText primary={val} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLoadDialog}>Cancel</Button>
                    <Button onClick={() => handleCloseLoadDialogWithCallback(props.callback)}>Load</Button>
                </DialogActions>
            </Dialog>
        </>
    )
} export default LoadDialogForm;