import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useInvoices } from '../../api/hooks/invoices/useInvoices';
import { useInvoice } from '../../api/hooks/invoices/useInvoice';
import { useCreateInvoice } from '../../api/hooks/invoices/useCreateInvoice';
import { useUpdateInvoice } from '../../api/hooks/invoices/useUpdateInvoice';
import { useDeleteInvoice } from '../../api/hooks/invoices/useDeleteInvoice';
import { InvoiceUpdate, InvoiceStatus } from '../../types/invoice.types';
import { useCompany } from '../../api/hooks/companies/useCompany';

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
  const [formCreate, setFormCreate] = useState<{
    company_id: number;
    amount: string;
    status: InvoiceStatus;
  }>({
    company_id: 0,
    amount: '',
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
  const companyQuery = useCompany();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 1) {
      setFormCreate({
        company_id: 0,
        amount: '',
        status: 'Pending',
      });
    }
  };

  const handleCreateSubmit = () => {
    const companyId = formCreate.company_id || companyQuery.data?.[0]?.id;
    if (!companyId || formCreate.amount === '') return;

    createInvoice.mutate({
      company_id: companyId,
      amount: Number(formCreate.amount),
      status: formCreate.status,
    });
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
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setTabValue(2);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setTabValue(3);
                        }}
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
            {companyQuery.isLoading ? (
              <Typography>Loading companies...</Typography>
            ) : (
              <TextField
                select
                label="Select Company"
                value={formCreate.company_id}
                onChange={(e) =>
                  setFormCreate((prev) => ({
                    ...prev,
                    company_id: Number(e.target.value),
                  }))
                }
              >
                {companyQuery.data?.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Amount"
              type="number"
              value={formCreate.amount}
              onChange={(e) =>
                setFormCreate((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Select an invoice to view:</Typography>
          <Stack spacing={2}>
            {invoicesQuery.data?.map((inv) => (
              <Card
                key={inv.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  background: selectedInvoiceId === inv.id ? '#f0f0f0' : 'inherit',
                }}
                onClick={() => setSelectedInvoiceId(inv.id)}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Invoice #{inv.id}</Typography>
                  <Typography>€{inv.amount.toFixed(2)}</Typography>
                </Stack>
                <Typography variant="body2">Status: {inv.status}</Typography>
              </Card>
            ))}
          </Stack>

          {selectedInvoiceId && invoiceQuery.data && (
            <Card sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6">Invoice Details</Typography>
              <Typography>Company ID: {invoiceQuery.data.company_id}</Typography>
              <Typography>Amount: €{invoiceQuery.data.amount.toFixed(2)}</Typography>
              <Typography>Issued: {format(new Date(invoiceQuery.data.issued_at), 'yyyy-MM-dd')}</Typography>
              <Typography>Status: {invoiceQuery.data.status}</Typography>
            </Card>
          )}
        </TabPanel>

        {/* Tab 3: Update Invoice */}
        <TabPanel value={tabValue} index={3}>
          <TextField
            select
            label="Select Invoice to Update"
            value={selectedInvoiceId ?? ''}
            onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
          >
            {invoicesQuery.data?.map((inv) => (
              <MenuItem key={inv.id} value={inv.id}>
                Invoice #{inv.id} – €{inv.amount}
              </MenuItem>
            ))}
          </TextField>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={formUpdate.amount ?? ''}
              onChange={(e) =>
                setFormUpdate((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
            <TextField
              select
              label="Status"
              value={formUpdate.status ?? ''}
              onChange={(e) =>
                setFormUpdate((prev) => ({
                  ...prev,
                  status: e.target.value as InvoiceStatus,
                }))
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
