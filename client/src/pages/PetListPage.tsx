import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setCredentials } from "../features/auth/authSlice";
import { Link as RouterLink } from "react-router-dom";


interface Pet {
  _id: string;
  name: string;
  species: string;
  photo?: string;
  notes?: string;
}

const PetListPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [pets, setPets] = useState<Pet[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", species: "cat", notes: "", household: "" });
  const [households, setHouseholds] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      dispatch(setCredentials({ token: storedToken }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPets(res.data))
      .catch(() => setPets([]));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios
        .get("/api/households", {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
        setHouseholds(res.data);
        if (res.data.length > 0 && !form.household) {
            setForm((prev) => ({ ...prev, household: res.data[0]._id }));
        }
        })
        .catch(() => setHouseholds([]));
    // eslint-disable-next-line
    }, [token]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPet = async () => {
    if (!token || !form.household) return;
    try {
      const res = await axios.post(
        "/api/pets",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPets([...pets, res.data]);
      setOpen(false);
      setForm({ name: "", species: "cat", notes: "", household: "" });
    } catch (err) {
      console.error("Error adding pet:", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Your Pets</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Pet
        </Button>
      </Box>
      <Grid container spacing={2}>
        {pets.map((pet) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={pet._id}>
              <Card
                component={RouterLink}
                to={`/pets/${pet._id}`}
                sx={{ textDecoration: "none", cursor: "pointer" }}
              >
                {pet.photo && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={pet.photo}
                    alt={pet.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{pet.name}</Typography>
                  <Typography color="text.secondary">{pet.species}</Typography>
                  {pet.notes && (
                    <Typography variant="body2" color="text.secondary">
                      {pet.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a Pet</DialogTitle>
        <DialogContent>
            <FormControl fullWidth margin="dense">
                <InputLabel id="household-label">Household</InputLabel>
                <Select
                    labelId="household-label"
                    name="household"
                    value={form.household}
                    label="Household"
                    onChange={(e) =>
                    setForm({ ...form, household: e.target.value as string })
                    }
                    required
                >
                    {households.map((hh) => (
                    <MenuItem value={hh._id} key={hh._id}>
                        {hh.name}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Species"
            name="species"
            value={form.species}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPet} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetListPage;