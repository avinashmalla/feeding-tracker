import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Avatar,
  Button,
  DialogActions,
} from "@mui/material";

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
  petName?: string; // Add petName prop
}

const FeedingLogDetailDialog: React.FC<FeedingLogDetailDialogProps> = ({
  open,
  onClose,
  log,
  petName,
}) => {
  if (!log) return null;
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {petName ? `${petName}` : "Feeding Details"}
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
        <Typography variant="body1" sx={{ mt: 2 }}>
          {log.note || "No note provided."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedingLogDetailDialog;