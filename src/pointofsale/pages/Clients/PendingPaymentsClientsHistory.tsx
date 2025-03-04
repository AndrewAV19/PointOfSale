import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
} from "@mui/material";
import { Search, Visibility, Download } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { dataStore } from "../../../stores/generalData.store";
import { storeClients } from "../../../stores/clients.store";

export default function PendingPaymentsClientsHistory() {
  const { listClientsWithPendingPayments, getClientsWithPendingPayments } =
    storeClients();
  const { getClientById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [clients, setClients] = useState(listClientsWithPendingPayments);
  const pdfRef = useRef(null);

  useEffect(() => {
    getClientsWithPendingPayments();
  }, [getClientsWithPendingPayments]);

  useEffect(() => {
    setClients(listClientsWithPendingPayments);
  }, [listClientsWithPendingPayments]);

  const filteredClients = clients.filter((client) =>
    client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const exportToPDF = () => {
    const input = pdfRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Historial_de_Clientes-con-pagos-pendientes.pdf");
    });
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg" ref={pdfRef}>
      <h2 className="text-2xl font-bold mb-4">Clientes con Pagos Pendientes</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          startAdornment={<Search className="text-gray-500" />}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={exportToPDF}
        >
          Exportar
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full border rounded-lg">
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    No hay clientes con pagos pendientes.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-100">
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getClientById(client.id ?? 0);
                        navigate(`/clientes/editar/pagos-pendientes`);
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
