import { AppBar, Button, Drawer, Grid, Paper, TextField, Toolbar, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

interface IDrawerCreateMediaProps{
  modalCreateMediaIsOpen: boolean
  toggleModalMediaCreation:()=>void
  CreateMediaWithLink:(link:string)=>void
}

export const DrawerLinkMedia=({modalCreateMediaIsOpen,toggleModalMediaCreation,CreateMediaWithLink}:IDrawerCreateMediaProps)=>{
  const [mediaLink, setMediaLink] = useState('');

  const handleNameChange  = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    setMediaLink(event.target.value);
  },[])

  const handleLinkingMedia = useCallback((event?:FormEvent)=>{
    if (event) event.preventDefault();
    toggleModalMediaCreation();
    CreateMediaWithLink(mediaLink);
    setMediaLink('');
  },[CreateMediaWithLink, mediaLink, toggleModalMediaCreation])

  const handleToggleModalGroupCreation= useCallback(()=>{
    toggleModalMediaCreation();
    setMediaLink('');
  },[CreateMediaWithLink])

  console.log(modalCreateMediaIsOpen);

  return (
    <>
      <div>
        <Drawer sx={{zIndex:9999}} anchor="bottom" open={modalCreateMediaIsOpen} onClose={handleToggleModalGroupCreation}>
          <Paper
            sx={{
              left: '0',
              marginTop: 6,
              paddingBottom: 2,
              paddingLeft: { sm: 3, xs: 2 },
              paddingRight: { sm: 3, xs: 2 },
              paddingTop: 2,
              right: '0',
              zIndex:9999
            }}
          >

            <AppBar position="absolute" color="primary" enableColorOnDark >
              <Toolbar variant="dense">
                <Button
                  color="inherit"
                  onClick={toggleModalMediaCreation}
                >
                  <ExpandMoreIcon />
                </Button>
                <Typography>LINK MEDIA</Typography>
              </Toolbar>
            </AppBar>
            <form onSubmit={handleLinkingMedia}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <label>Media's link :</label>
                </Grid>
                <Grid item sx={{ width: "70%" }}>
                  <TextField onChange={handleNameChange} sx={{ width: "100%" }}></TextField>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleLinkingMedia}
                  >
                    ADD
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Drawer>
      </div>
    </>
  )
}
