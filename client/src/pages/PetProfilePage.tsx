import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import FeedingLogList from "../components/FeedingLogList";
import AddFeedingDialog from "../components/AddFeedingDialog";

interface Pet {
  _id: string;
  name: string;
  species: string;
  photo?: string;
  notes?: string;
}

const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);
  const [feedingLogKey, setFeedingLogKey] = useState(0); // for forcing FeedingLogList refresh

  useEffect(() => {
    if (!token || !petId) return;
    setLoading(true);
    axios
      .get(`/api/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPet(res.data))
      .catch(() => setPet(null))
      .finally(() => setLoading(false));
  }, [token, petId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!pet) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5">Pet not found.</Typography>
        <Button component={RouterLink} to="/pets" sx={{ mt: 2 }}>
          Back to Pets
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          {pet.photo ? (
            <Avatar src={pet.photo} alt={pet.name} sx={{ width: 120, height: 120, mb: 2 }} />
          ) : (
            <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
              {pet.name[0]}
            </Avatar>
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {pet.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Species: {pet.species}
            </Typography>
            {pet.notes && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Notes: {pet.notes}
              </Typography>
            )}
          </CardContent>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to={`/pets`}
            sx={{ mt: 2 }}
          >
            Back to Pets
          </Button>
        </Box>
      </Card>
      <Typography variant="h5" sx={{ mt: 4 }}>
        Feeding Log
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => setFeedingDialogOpen(true)}
      >
        Add Feeding
      </Button>
      <AddFeedingDialog
        open={feedingDialogOpen}
        onClose={() => setFeedingDialogOpen(false)}
        petId={pet._id}
        onAdded={() => setFeedingLogKey((k) => k + 1)}
      />
      <FeedingLogList petId={pet._id} petName={pet.name} key={feedingLogKey} />
    </Container>
  );
};

export default PetProfilePage;