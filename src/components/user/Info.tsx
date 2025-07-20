import { formatHex } from "@/utils/formatters";
import { UserAvatar } from "@/components/common/Avatar";
import {
    Text,
    Box,
    Clipboard,
    HStack,
    IconButton
}from "@chakra-ui/react";

interface InfoProps {
    walletAddress: string;  
}

export function Info({ walletAddress }: InfoProps) {
    return (
        <Box py={4} >
            <HStack gap={1}>
                <Text fontWeight="bold" fontSize="lg" pr={4}>
                    Nest Account
                </Text>
                <UserAvatar walletAddress={walletAddress} size={5} />
                <Text fontFamily={'mono'} fontWeight="light" fontSize='sm' color='gray.600'>
                    {formatHex(walletAddress)}
                </Text>
                <Clipboard.Root value={walletAddress}>
                    <Clipboard.Trigger asChild>
                        <IconButton aria-label="Copy Address" variant='ghost' colorPalette='teal' size='sm' pb={1}>
                            <Clipboard.Indicator/>
                        </IconButton>
                    </Clipboard.Trigger>
                </Clipboard.Root>
            </HStack>
        </Box>
    );
}