"use client"

import { createOverlay, HStack, Text } from '@chakra-ui/react'
import { BsCupHot } from 'react-icons/bs'
import { TipJarDialog } from './TipJarDialog'

interface TipJarDialogProps {
    open?: boolean
    onOpenChange?: (_e: { open: boolean }) => void
}

const tipJarOverlay = createOverlay<TipJarDialogProps>(TipJarDialog)

export function TipJar() {
    const handleOpenDialog = () => {
        tipJarOverlay.open('tip-jar-dialog', {})
    }

    return (
        <>
            <tipJarOverlay.Viewport/>
            <HStack gap={1} align="center">
                <BsCupHot size={14} />
                <Text 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.600"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    transition="text-decoration 0.2s"
                    onClick={handleOpenDialog}
                >
                    Tip the Dev
                </Text>
            </HStack>
        </>
    )
}