'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Divider,
} from '@mui/material';
import Cloud from '@mui/icons-material/Cloud';
import Air from '@mui/icons-material/Air';
import Opacity from '@mui/icons-material/Opacity';
import Waves from '@mui/icons-material/Waves';
import NightsStay from '@mui/icons-material/NightsStay';
import Thermostat from '@mui/icons-material/Thermostat';
import { FishingAssessment, WeatherData, TideData, MoonPhaseData } from '@/types';
import { getRecommendationColor, getRecommendationEmoji } from '@/lib/fishingScore';

interface FishingResultCardProps {
  assessment: FishingAssessment;
  weather: WeatherData | null;
  tide: TideData | null;
  moonPhase: MoonPhaseData | null;
  date: Date;
}

export default function FishingResultCard({
  assessment,
  weather,
  tide,
  moonPhase,
  date,
}: FishingResultCardProps) {
  const recommendationColor = getRecommendationColor(assessment.recommendation);
  const emoji = getRecommendationEmoji(assessment.recommendation);

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              {date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        }
        sx={{
          backgroundColor: recommendationColor,
          color: 'white',
          pb: 1,
        }}
      />

      <CardContent sx={{ pt: 2 }}>
        {/* Score e Recomendação */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {emoji}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {assessment.recommendation}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={assessment.score}
              sx={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: recommendationColor,
                },
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 40 }}>
              {assessment.score}%
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Dados Meteorológicos */}
        {weather && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Condições Meteorológicas
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Thermostat sx={{ color: '#ff9800', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Temperatura
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {weather.temperature}°C
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Opacity sx={{ color: '#2196f3', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Pressão
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {weather.pressure} hPa
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Air sx={{ color: '#4caf50', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Vento
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {weather.windSpeed} km/h {weather.windDirection}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cloud sx={{ color: '#9c27b0', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Nuvens
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {weather.cloudCover}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Dados Solunares */}
        {moonPhase && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Dados Solunares
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NightsStay sx={{ color: '#fbc02d', fontSize: 24 }} />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Fase da Lua
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {moonPhase.phase}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={`${moonPhase.illumination}%`}
                size="small"
                sx={{ backgroundColor: '#fbc02d', color: 'white' }}
              />
            </Box>
          </Box>
        )}

        {/* Dados de Maré */}
        {tide && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Dados de Maré
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Waves sx={{ color: '#00bcd4', fontSize: 24 }} />
              <Box>
                <Typography variant="caption" color="textSecondary">
                  {tide.type === 'high' ? 'Maré Alta' : 'Maré Baixa'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {tide.height.toFixed(2)} m
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Detalhes */}
        {assessment.details.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Análise Detalhada
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {assessment.details.map((detail, index) => (
                <Typography key={index} variant="caption" color="textSecondary">
                  • {detail}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
