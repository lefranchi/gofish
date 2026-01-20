'use client';

import { Container, Box, Typography, Button, Stack } from '@mui/material';
import FishIcon from '@mui/icons-material/Pets';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <FishIcon sx={{ fontSize: 80, color: 'primary.main' }} />
        
        <Typography variant="h1" component="h1">
          GoFish
        </Typography>
        
        <Typography variant="h3" color="textSecondary">
          Descubra as melhores condições para pescar
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 400 }}>
          Analise parâmetros meteorológicos em tempo real e receba recomendações personalizadas para sua pescaria.
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button variant="contained" size="large" component={Link} href="/login">
            Entrar
          </Button>
          <Button variant="outlined" size="large" component={Link} href="/register">
            Registrar
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
