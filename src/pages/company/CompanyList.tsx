import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../api/hooks/companies/useCompany';
import { useCreateCompany } from '../../api/hooks/companies/useCreateCompany';
import { useDeleteCompany } from '../../api/hooks/companies/useDeleteCompany';
import { useUpdateCompany } from '../../api/hooks/companies/useUpdateCompany';
import { CompanyResponse } from '../../types/company.types';
import { getPath } from '../../routes/routes';

interface CompanyForm {
  name: string;
  industry: string;
  country: string;
}

export default function CompanyList() {
  const { data: companies, isLoading } = useCompany();
  const { mutate: createCompany } = useCreateCompany();
  const { mutate: deleteCompany } = useDeleteCompany();
  const { mutate: updateCompany } = useUpdateCompany();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    name: '',
    industry: '',
    country: '',
  });

  const handleDelete = (companyId: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(companyId);
    }
  };

  const openCreateModal = () => {
    setEditingCompanyId(null);
    setCompanyForm({ name: '', industry: '', country: '' });
    setModalOpen(true);
  };

  const openEditModal = (company: CompanyResponse) => {
    setEditingCompanyId(company.id);
    setCompanyForm({
      name: company.name ?? '',
      industry: company.industry ?? '',
      country: company.country ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const { name, industry, country } = companyForm;
    if (!name || !industry || !country) {
      alert('All fields are required');
      return;
    }

    if (editingCompanyId !== null) {
      updateCompany(
        { id: editingCompanyId, companyData: companyForm },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingCompanyId(null);
          },
        }
      );
    } else {
      createCompany(companyForm, {
        onSuccess: () => setModalOpen(false),
      });
    }

    setCompanyForm({ name: '', industry: '', country: '' });
  };
  const navigate = useNavigate();

  const filteredCompanies = companies?.filter((company) =>
    company.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Companies</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
            Add Company
          </Button>
        </Box>

        <Card>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Industry</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies?.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.country}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                        size="small"
                        onClick={() => navigate(getPath('companyDepartments').replace(':companyId', `${company.id}`))}
                        title="View Departments"
                        >
                        <InfoIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => openEditModal(company)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(company.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingCompanyId ? 'Edit Company' : 'Create New Company'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company Name"
              fullWidth
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
            />
            <TextField
              label="Industry"
              fullWidth
              value={companyForm.industry}
              onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
            />
            <TextField
              label="Country"
              fullWidth
              value={companyForm.country}
              onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingCompanyId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
