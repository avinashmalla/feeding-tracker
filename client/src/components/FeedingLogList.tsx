import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  ListItemButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import FeedingLogDetailDialog from "./FeedingLogDetailDialog";

interface FeedingLog {
  _id: string;
  photo?: string;
  note?: string;
  createdAt: string;
}

interface FeedingLogListProps {
  petId: string;
  petName: string;
}

const FeedingLogList: React.FC<FeedingLogListProps> = ({ petId, petName }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<FeedingLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!token || !petId) return;
    setLoading(true);
    axios
      .get(`/api/feedings/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [token, petId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 4 }}>
        No feedings logged yet.
      </Typography>
    );
  }

  return (
    <>
      <List sx={{ mt: 4 }}>
        {logs.map((log) => (
          <ListItem
            key={log._id}
            alignItems="flex-start"
            sx={{ cursor: "pointer" }}
          >
            <ListItemButton
              onClick={() => {
                setSelectedLog(log);
                setDetailOpen(true);
              }}
            >
              <ListItemAvatar>
                {log.photo ? (
                  <Avatar src={log.photo} />
                ) : (
                  <Avatar>🍽️</Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={new Date(log.createdAt).toLocaleString()}
                secondary={log.note}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <FeedingLogDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        log={selectedLog}
        petName={petName} // Pass the prop here
      />
    </>
  );
};

export default FeedingLogList;