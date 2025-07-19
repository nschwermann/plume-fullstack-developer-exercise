"use client"

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import {
    Box,
    Flex,
    HStack,
    Text,
    Popover,
    Portal
} from '@chakra-ui/react';

import { Logo } from './Logo';
import { UserAvatarWithFallback } from './Avatar';
import { formatHex } from '@/utils/formatters';
import Link from 'next/link';

export function Header() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();

    return (
        <Flex 
            align="center" 
            justify="space-between" 
            py={2}
            px={4}
            border={"1px solid"} 
            borderColor="border.muted" 
            bg="white" 
            rounded='2xl'
            boxShadow="sm">
                <Link href="/" passHref>
                    <Logo />
                </Link>
                <Popover.Root positioning={{ placement: "bottom-end" }}>
                    <Popover.Trigger asChild>
                        <Box 
                            border={"1px solid"} 
                            borderColor="border.muted" 
                            rounded='2xl' 
                            p={2} 
                            bg="white"
                            cursor="pointer"
                            _hover={{ bg: "teal.50" }}
                            transition="background 0.2s"
                        >
                            <HStack gap={2} align="center">
                                <UserAvatarWithFallback walletAddress={address} />
                                {address ? (
                                    <Text fontSize="sm" fontFamily='mono' fontWeight='semibold' color='text' userSelect="none">
                                        {formatHex(address)}
                                    </Text>
                                ) : (
                                    <Text fontSize="sm" fontWeight='semibold' color='text' userSelect="none">
                                        Connect Wallet
                                    </Text>
                                )}
                            </HStack>
                        </Box>
                    </Popover.Trigger>
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content maxW="200px">
                                <Popover.Body p={0}>
                                    <Text
                                        px={3}
                                        py={2}
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={address ? "red.600" : "blue.600"}
                                        cursor="pointer"
                                        borderRadius="md"
                                        userSelect="none"
                                        _hover={{ 
                                            bg: address ? "red.50" : "blue.50",
                                            color: address ? "red.700" : "blue.700"
                                        }}
                                        transition="all 0.2s"
                                        onClick={() => address ? disconnect() : open()}
                                    >
                                        {address ? "Disconnect Wallet" : "Connect Wallet"}
                                    </Text>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
                
        </Flex>
    );
}