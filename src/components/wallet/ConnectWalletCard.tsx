

import { Box, Card, VStack, Text, Button } from "@chakra-ui/react"
import { Logo } from "@/components/common/Logo"
import { useAppKit } from '@reown/appkit/react'


export function ConnectWalletCard() {
  const { open } = useAppKit()

  return (
    <Box 
      minHeight="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      dropShadow='lg'
      px={4}
    >
      <Card.Root 
        width="full" 
        maxWidth="400px" 
        p={8}
        textAlign="center"
      >
        <Card.Body>
          <VStack gap={6}>
            <Logo />
            <Text fontSize="lg" color="text.primary">
              Connect your wallet to start using Nest.
            </Text>
            <Button
              colorPalette="teal"
              onClick={() => open()}
              width="full"
              variant="solid"
            >
              Connect Wallet
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}