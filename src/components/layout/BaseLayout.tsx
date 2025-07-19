import { Header } from "@/components/common/Header"
import { Container, Box } from "@chakra-ui/react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: AppLayoutProps) {
  return (
    <Box pt={2} px={4}>
      <Header/>
      <Container maxW="8xl" py={4}>
        {children}
      </Container>
    </Box>
  )
}