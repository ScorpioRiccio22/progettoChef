import Box from '@mui/material/Box'

interface VesuvioMarkProps {
  className?: string
}

export default function VesuvioMark({ className }: VesuvioMarkProps) {
  return (
    <Box
      component="img"
      src="/logo.svg"
      alt="Logo"
      className={className}
      draggable={false}
    />
  )
}