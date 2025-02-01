// src\component\Flash.tsx
import { create } from "zustand";
import { useCallback } from "react";
import { Snackbar, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface FlashStore {
  visible: boolean;
  msg: string | null;
  close: () => void;
  open: (msg: string) => void;
}

export const useFlashStore = create<FlashStore>((set) => ({
  visible: false,
  msg: null,
  close: () => set({ visible: false, msg: null }),
  open: (msg: string) => set({ visible: true, msg }),
}));

export default function Flash() {
  const { visible, msg, close } = useFlashStore();

  const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== "clickaway") close();
  }, [close]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={visible}
      autoHideDuration={6000}
      onClose={handleClose}
      message={msg}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
