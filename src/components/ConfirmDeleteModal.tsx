import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly title: string;
  readonly message: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      aria-labelledby="confirm-dialog-title" 
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle 
        id="confirm-dialog-title" 
        sx={{ backgroundColor: "#f0f0f0", color: "#333", padding: "16px", marginBottom: "10px"}}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography id="confirm-dialog-description" variant="body1">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <Button 
          onClick={onClose} 
          color="primary" 
          variant="outlined"
          sx={{ borderRadius: "8px" }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          sx={{ borderRadius: "8px", boxShadow: "none" }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
