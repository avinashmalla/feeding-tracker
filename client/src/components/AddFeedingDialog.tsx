import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface AddFeedingDialogProps {
  open: boolean;
  onClose: () => void;
  petId: string;
  onAdded: () => void;
}

const AddFeedingDialog: React.FC<AddFeedingDialogProps> = ({
  open,
  onClose,
  petId,
  onAdded,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleAddFeeding = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("note", note);
      if (photo) formData.append("photo", photo);

      await axios.post(`/api/feedings/${petId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNote("");
      setPhoto(null);
      onAdded();
      onClose();
    } catch (err) {
      // handle error (show message, throw error etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Feeding</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Note"
          fullWidth
          multiline
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
        />
        <Box mt={2}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddFeeding}
          variant="contained"
          disabled={loading}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFeedingDialog;