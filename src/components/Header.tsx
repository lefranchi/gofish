'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import FishIcon from '@mui/icons-material/Pets';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FishIcon sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            GoFish
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} href="/login">
            Entrar
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'white', color: '#1976d2' }}
            component={Link}
            href="/register"
          >
            Registrar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
