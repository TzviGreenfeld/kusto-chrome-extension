import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useLogin from '../hooks/useLogin';
import { UserData } from '../hooks/useLogin';

export function FormDialog({
  onFormSubmit,
  children,
}: {
  onFormSubmit: (data: UserData) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    onFormSubmit({ name: formJson.name } as UserData);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} color="inherit">
        {children}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set your userName, this will be used to sync your saved queries
            across devices.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            type="text"
            label="User Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Login</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function LoginButton() {
  const { isUserDataEmpty, getUserData, updateUserData } = useLogin();

  const loggedOut = (
    <FormDialog onFormSubmit={updateUserData}>Login</FormDialog>
  );
  const loggedIn = (
    <>
      <Typography variant="h6" component="div" sx={{ mr: 2 }}>
        {getUserData()?.name}
      </Typography>
      <Button
        color="inherit"
        onClick={() => {
          updateUserData({ name: '' });
        }}
      >
        <Typography variant="h6" component="div">
          Logout
        </Typography>
      </Button>
    </>
  );

  return <>{isUserDataEmpty() ? loggedOut : loggedIn}</>;
}

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <BookmarkIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <LoginButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
