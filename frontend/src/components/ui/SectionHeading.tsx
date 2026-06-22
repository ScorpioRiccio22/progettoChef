import { Box, Typography } from '@mui/material'
import VesuvioMark from './VesuvioMark'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === 'center'
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCenter ? 'center' : 'flex-start',
        textAlign: isCenter ? 'center' : 'left',
        maxWidth: isCenter ? 680 : 560,
        mx: isCenter ? 'auto' : 0,
        mb: { xs: 5, md: 7 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          mb: 2,
          color: light ? '#D9B679' : '#B8893E',
        }}
      >
        <VesuvioMark className="w-6 h-3" color="currentColor" />
        <Typography
          component="span"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontSize: '0.78rem',
          }}
        >
          {eyebrow}
        </Typography>
      </Box>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.9rem', md: '2.6rem' },
          color: light ? '#FBF6EC' : '#1C1712',
          lineHeight: 1.15,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          sx={{
            mt: 2,
            fontSize: '1.05rem',
            color: light ? 'rgba(251,246,236,0.78)' : '#332A21',
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  )
}
