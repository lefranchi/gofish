'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FishingResultCard from '@/components/FishingResultCard';
import { SearchResult } from '@/types';

interface Fishery {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function DashboardPage() {
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [selectedFishery, setSelectedFishery] = useState<Fishery | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFishery, setNewFishery] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });
  const [error, setError] = useState('');

  // Simular carregamento de pesqueiros
  useEffect(() => {
    const mockFisheries: Fishery[] = [
      {
        id: 1,
        name: 'Rio Araguaia - GO',
        latitude: -13.1939,
        longitude: -50.7589,
      },
      {
        id: 2,
        name: 'Represa de Sobradinho - BA',
        latitude: -9.4139,
        longitude: -40.8353,
      },
      {
        id: 3,
        name: 'Lagoa Araruama - RJ',
        latitude: -22.8667,
        longitude: -42.3333,
      },
    ];
    setFisheries(mockFisheries);
  }, []);

  const handleFetchForecast = async () => {
    if (!selectedFishery) {
      setError('Selecione um pesqueiro');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/fishing-forecast?latitude=${selectedFishery.latitude}&longitude=${selectedFishery.longitude}&date=${selectedDate}&fisheryId=${selectedFishery.id}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar previsão');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Erro ao buscar dados de pesca. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFishery = async () => {
    if (!newFishery.name || !newFishery.latitude || !newFishery.longitude) {
      setError('Preencha todos os campos');
      return;
    }

    const fishery: Fishery = {
      id: Date.now(),
      name: newFishery.name,
      latitude: parseFloat(newFishery.latitude),
      longitude: parseFloat(newFishery.longitude),
    };

    setFisheries([...fisheries, fishery]);
    setNewFishery({ name: '', latitude: '', longitude: '' });
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Previsão de Pesca
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Seleção de Pesqueiro */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Selecione um Pesqueiro
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {fisheries.map((fishery) => (
                <Grid item xs={12} sm={6} key={fishery.id}>
                  <Card
                    onClick={() => setSelectedFishery(fishery)}
                    sx={{
                      cursor: 'pointer',
                      border:
                        selectedFishery?.id === fishery.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor:
                        selectedFishery?.id === fishery.id ? '#f5f5f5' : 'white',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {fishery.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Lat: {fishery.latitude.toFixed(4)}, Lon: {fishery.longitude.toFixed(4)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              fullWidth
            >
              Adicionar Pesqueiro
            </Button>
          </CardContent>
        </Card>

        {/* Seleção de Data */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Selecione a Data
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />

              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleFetchForecast}
                disabled={!selectedFishery || loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Buscar'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Resultado */}
        {result && (
          <Box sx={{ mb: 3 }}>
            {result.assessment && (
              <FishingResultCard
                assessment={result.assessment}
                weather={result.weather}
                tide={result.tide}
                moonPhase={result.moonPhase}
                date={new Date(result.date)}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Dialog para adicionar pesqueiro */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Novo Pesqueiro</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nome do Pesqueiro"
            value={newFishery.name}
            onChange={(e) => setNewFishery({ ...newFishery, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            inputProps={{ step: '0.0001' }}
            value={newFishery.latitude}
            onChange={(e) => setNewFishery({ ...newFishery, latitude: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            inputProps={{ step: '0.0001' }}
            value={newFishery.longitude}
            onChange={(e) => setNewFishery({ ...newFishery, longitude: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddFishery}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
