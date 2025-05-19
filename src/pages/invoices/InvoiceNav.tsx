import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import { useInvoices } from '../../api/hooks/invoices/useInvoices';
import { useInvoice } from '../../api/hooks/invoices/useInvoice';
import { useCreateInvoice } from '../../api/hooks/invoices/useCreateInvoice';
import { useUpdateInvoice } from '../../api/hooks/invoices/useUpdateInvoice';
import { useDeleteInvoice } from '../../api/hooks/invoices/useDeleteInvoice';
import { InvoiceCreate, InvoiceUpdate, InvoiceStatus } from '../../types/invoice.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Invoices() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [formCreate, setFormCreate] = useState<InvoiceCreate>({
    company_id: 0,
    amount: 0,
    status: 'Pending',
  });
  const [formUpdate, setFormUpdate] = useState<InvoiceUpdate>({
    amount: undefined,
    status: undefined,
  });

  const invoicesQuery = useInvoices();
  const invoiceQuery = useInvoice(selectedInvoiceId ?? 0, selectedInvoiceId !== null);
  const createInvoice = useCreateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const updateInvoice = useUpdateInvoice(selectedInvoiceId ?? 0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateSubmit = () => {
    createInvoice.mutate(formCreate);
  };

  const handleUpdateSubmit = () => {
    if (selectedInvoiceId) {
      updateInvoice.mutate(formUpdate);
    }
  };

  const handleDelete = (id: number) => {
    deleteInvoice.mutate(id);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Invoices</Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Invoices" />
            <Tab label="Create Invoice" />
            <Tab label="View Invoice" />
            <Tab label="Update Invoice" />
          </Tabs>
        </Box>

        {/* Tab 0: All Invoices */}
        <TabPanel value={tabValue} index={0}>
          {invoicesQuery.isLoading ? (
            <Typography>Loading invoices...</Typography>
          ) : (
            <Stack spacing={2}>
              {invoicesQuery.data?.map((inv) => (
                <Card key={inv.id} sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Typography>Invoice #{inv.id}</Typography>
                    <Typography>Company ID: {inv.company_id}</Typography>
                    <Typography>Amount: €{inv.amount.toFixed(2)}</Typography>
                    <Typography>Issued: {format(new Date(inv.issued_at), 'yyyy-MM-dd')}</Typography>
                    <Chip label={inv.status} color={inv.status === 'Paid' ? 'success' : 'warning'} />

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedInvoiceId(inv.id)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => setSelectedInvoiceId(inv.id)}
                      >
                        Update
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(inv.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </TabPanel>

        {/* Tab 1: Create Invoice */}
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={2}>
            <TextField
              label="Company ID"
              type="number"
              value={formCreate.company_id}
              onChange={(e) =>
                setFormCreate((prev) => ({ ...prev, company_id: Number(e.target.value) }))
              }
            />
            <TextField
              label="Amount"
              type="number"
              value={formCreate.amount}
              onChange={(e) =>
                setFormCreate((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
            />
            <TextField
              select
              label="Status"
              value={formCreate.status}
              onChange={(e) =>
                setFormCreate((prev) => ({ ...prev, status: e.target.value as InvoiceStatus }))
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleCreateSubmit}>
              Create Invoice
            </Button>
          </Stack>
        </TabPanel>

        {/* Tab 2: View Invoice */}
        <TabPanel value={tabValue} index={2}>
          <TextField
            label="Invoice ID"
            type="number"
            value={selectedInvoiceId ?? ''}
            onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          {invoiceQuery.isLoading ? (
            <Typography>Loading invoice...</Typography>
          ) : invoiceQuery.data ? (
            <Card sx={{ p: 2 }}>
              <Typography>Invoice #{invoiceQuery.data.id}</Typography>
              <Typography>Company ID: {invoiceQuery.data.company_id}</Typography>
              <Typography>Amount: €{invoiceQuery.data.amount.toFixed(2)}</Typography>
              <Typography>Issued: {format(new Date(invoiceQuery.data.issued_at), 'yyyy-MM-dd')}</Typography>
              <Typography>Status: {invoiceQuery.data.status}</Typography>
            </Card>
          ) : (
            <Typography>No invoice found.</Typography>
          )}
        </TabPanel>

        {/* Tab 3: Update Invoice */}
        <TabPanel value={tabValue} index={3}>
          <TextField
            label="Invoice ID"
            type="number"
            value={selectedInvoiceId ?? ''}
            onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
          />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={formUpdate.amount ?? ''}
              onChange={(e) =>
                setFormUpdate((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
            />
            <TextField
              select
              label="Status"
              value={formUpdate.status ?? ''}
              onChange={(e) =>
                setFormUpdate((prev) => ({ ...prev, status: e.target.value as InvoiceStatus }))
              }
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleUpdateSubmit} disabled={!selectedInvoiceId}>
              Update Invoice
            </Button>
          </Stack>
        </TabPanel>
      </Card>
    </Stack>
  );
}
