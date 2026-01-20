'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import FishIcon from '@mui/icons-material/Pets';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implementar autenticação real
      console.log('Login attempt:', { email, password });
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <FishIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              GoFish
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Faça login para acessar suas pescarias
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Não tem conta?{' '}
              <MuiLink component={Link} href="/register" sx={{ fontWeight: 700 }}>
                Registre-se
              </MuiLink>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
