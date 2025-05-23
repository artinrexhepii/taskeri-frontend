import { useState, useEffect, useMemo } from 'react';
import {
  Box,
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
import { useAuth } from '../../context/AuthContext';
import React from 'react';
import Button from '../../components/common/Button/Button';
import { PlusIcon } from '@heroicons/react/24/outline';

interface CompanyForm {
  name: string;
  industry: string;
  country: string;
}

export default function CompanyList() {
  const { data: companies, isLoading, refetch } = useCompany();
  const { mutate: createCompany } = useCreateCompany();
  const { mutate: deleteCompany } = useDeleteCompany();
  const { mutate: updateCompany } = useUpdateCompany();
  const { user, isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    name: '',
    industry: '',
    country: '',
  });

  const hasAdminAccess = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return user.role_id === 1;
  }, [user, isAuthenticated]);

  useEffect(() => {
    refetch();
  }, [user?.role_id, isAuthenticated, refetch]);

  const handleDelete = (companyId: number) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(companyId, {
        onSuccess: () => refetch(),
      });
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
            refetch();
          },
        }
      );
    } else {
      createCompany(companyForm, {
        onSuccess: () => {
          setModalOpen(false);
          refetch();
        },
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
        <Card sx={{ p: 3, bgcolor: 'teal.700', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1 }} className='text-black'>Companies</Typography>
              <Typography variant="body2" className='text-black' sx={{ opacity: 0.9 }}>
                Manage and track your organization's companies
              </Typography>
            </Box>
            {hasAdminAccess && (
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                onClick={openCreateModal}
              >
                Add Company
              </Button>
            )}
          </Box>
        </Card>

        <Card>
          <Box sx={{ p: 3 }}>
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
              sx={{ mb: 3 }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Industry</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCompanies?.map((company) => (
                    <TableRow
                      key={company.id}
                      sx={{ '&:hover': { bgcolor: 'teal.50' } }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">{company.name}</Typography>
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => navigate(getPath('companyDepartments').replace(':companyId', `${company.id}`))}
                            title="View Departments"
                            sx={{ color: 'teal.700' }}
                          >
                            <InfoIcon />
                          </IconButton>
                          {hasAdminAccess && (
                            <>
                              <IconButton size="small" onClick={() => openEditModal(company)} sx={{ color: 'teal.700' }}>
                                <EditIcon />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete(company.id)} sx={{ color: 'error.main' }}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCompanies?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <Typography color="text.secondary">No companies found</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </Stack>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
          <Typography variant="h6">
            {editingCompanyId ? 'Edit Company' : 'Create New Company'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company Name"
              fullWidth
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              required
            />
            <TextField
              label="Industry"
              fullWidth
              value={companyForm.industry}
              onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
              required
            />
            <TextField
              label="Country"
              fullWidth
              value={companyForm.country}
              onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingCompanyId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
