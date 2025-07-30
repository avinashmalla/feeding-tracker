import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface CreateHouseholdDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateHouseholdDialog: React.FC<CreateHouseholdDialogProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "/api/households",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create household");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Household</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Household Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {error && (
          <div style={{ color: "red", marginTop: 8 }}>{error}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading || !name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateHouseholdDialog;