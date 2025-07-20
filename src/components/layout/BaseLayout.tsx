import { Header } from "@/components/common/Header"
import { TipJar } from "@/components/tipjar/TipJar"
import { Container, Box, Flex } from "@chakra-ui/react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function BaseLayout({ children }: AppLayoutProps) {
  return (
    <Flex direction="column" minH="100vh" pt={2} px={4}>
      <Header/>
      <Container maxW="8xl" py={4} flex="1">
        {children}
      </Container>
      <Box as="footer" py={4} borderTop="1px solid" borderColor="border.muted">
        <Flex justify="flex-end" maxW="8xl" mx="auto" px={4}>
          <TipJar />
        </Flex>
      </Box>
    </Flex>
  )
}