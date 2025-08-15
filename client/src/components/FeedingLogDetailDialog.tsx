import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Avatar,
  Button,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface FeedingLog {
  _id: string;
  photo?: string;
  note?: string;
  createdAt: string;
}

interface FeedingLogDetailDialogProps {
  open: boolean;
  onClose: () => void;
  log: FeedingLog | null;
  petName?: string;
  onUpdated?: () => void; // callback to refresh log list
}

const FeedingLogDetailDialog: React.FC<FeedingLogDetailDialogProps> = ({
  open,
  onClose,
  log,
  petName,
  onUpdated,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [editing, setEditing] = useState(false);
  const [editNote, setEditNote] = useState(log?.note || "");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setEditNote(log?.note || "");
    setEditing(false);
  }, [log, open]);

  const handleEdit = () => setEditing(true);

  const handleEditSave = async () => {
    if (!token || !log) return;
    setLoading(true);
    try {
      await axios.put(
        `/api/feedings/${log._id}`,
        { note: editNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      if (onUpdated) onUpdated();
      // Update the note in the local log object
      log.note = editNote;
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !log) return;
    setLoading(true);
    try {
      await axios.delete(`/api/feedings/${log._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  if (!log) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {petName ? `${petName}'s Feeding Schedule` : "Feeding Details"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          {log.photo ? (
            <Avatar
              src={log.photo}
              alt="Feeding Photo"
              sx={{ width: 180, height: 180, mb: 2 }}
              variant="rounded"
            />
          ) : (
            <Avatar sx={{ width: 180, height: 180, mb: 2 }}>🍽️</Avatar>
          )}
        </Box>
        <Typography variant="subtitle2" gutterBottom>
          {new Date(log.createdAt).toLocaleString()}
        </Typography>
        {editing ? (
          <TextField
            label="Note"
            fullWidth
            multiline
            rows={2}
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            sx={{ mt: 2 }}
            disabled={loading}
          />
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {log.note || "No note provided."}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {editing ? (
          <>
            <Button onClick={() => setEditing(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              disabled={loading || editNote.trim() === ""}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
            <Button onClick={handleEdit} variant="outlined">
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="outlined"
              disabled={loading}
            >
              Delete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FeedingLogDetailDialog;