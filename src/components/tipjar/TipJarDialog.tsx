"use client"

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useConfig, useBalance } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useAppKit } from '@reown/appkit/react'
import { parseEther, formatEther } from 'viem'
import {
    Button,
    Input,
    Text,
    VStack,
    Flex,
    Alert,
    Dialog,
    HStack,
    Image,
    Box,
} from '@chakra-ui/react'
import { getTipJarAddress } from '@/config/contracts'
import TipJarABI from '@/abi/TipJar.json'
import { useTokenPrice } from '@/hooks/useTokenPrice'

interface TipJarDialogProps {
    open?: boolean
    onOpenChange?: (_e: { open: boolean }) => void
}

export function TipJarDialog({ open = false, onOpenChange }: TipJarDialogProps) {
    const [tipAmount, setTipAmount] = useState('')
    const [error, setError] = useState('')
    const [showSuccessState, setShowSuccessState] = useState(false)
    
    const chainId = useChainId()
    const { address, isConnected } = useAccount()
    const { open: openConnectModal } = useAppKit()

    const { data: balance, isLoading: isLoadingBalance, queryKey: balanceQueryKey, refetch: refetchBalance } = useBalance({
        address,
        chainId,
    })

    const {data : tokenPrice} = useTokenPrice()

    const config = useConfig()
    const queryClient = useQueryClient()
    
    const { writeContract, data: hash, isPending : isTipPending, reset: resetWriteContract } = useWriteContract()
    const { isLoading: isConfirming, isSuccess : isTipSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isTipSuccess && open) {
            setShowSuccessState(true)
        }
    }, [isTipSuccess, open])

    useEffect(() => {
        if (open) {
            setShowSuccessState(false)
            setError('')
        }
    }, [open])

    const balanceInEther = balance ? formatEther(balance.value) : '0'
    const tipAmountNumber = parseFloat(tipAmount) || 0
    const tipAmountInUSD = useMemo(() => {
        if (tokenPrice && tipAmountNumber > 0) {
            return (tipAmountNumber * tokenPrice).toFixed(2)
        }
        return null
    }, [tokenPrice, tipAmountNumber])

    const hasInsufficientBalance = tipAmountNumber > parseFloat(balanceInEther)
    const hasNoBalance = parseFloat(balanceInEther) === 0
    const inputHasError = hasInsufficientBalance || (hasNoBalance && isConnected)

    const validateTipRequest = () => {
        if (!isConnected) return { isValid: false, error: 'Please connect your wallet first' }
        if (!tipAmount || parseFloat(tipAmount) <= 0) return { isValid: false, error: 'Please enter a valid tip amount' }
        if (hasNoBalance) return { isValid: false, error: 'Insufficient balance. You need PLUME tokens to send a tip.' }
        if (hasInsufficientBalance) return { isValid: false, error: `Insufficient balance. You can tip up to ${balanceInEther} PLUME.` }
        return { isValid: true, error: null }
    }

    const buildTipTransaction = () => {
        const contractAddress = getTipJarAddress(chainId)
        const amount = parseEther(tipAmount)
        const currentChain = config.chains.find(chain => chain.id === chainId)
        
        if (!currentChain) throw new Error('Unsupported network')
        
        return {
            abi: TipJarABI,
            address: contractAddress,
            functionName: 'tip',
            value: amount,
            account: address!,
            chain: currentChain,
        }
    }

    const executeTip = (transaction: {
        abi: typeof TipJarABI
        address: `0x${string}`
        functionName: string
        value: bigint
        account: `0x${string}`
        chain: NonNullable<ReturnType<typeof config.chains.find>>
    }) => {
        try {
            writeContract(transaction, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: balanceQueryKey })
                    refetchBalance()
                },
                onError: (error) => {
                    console.error('Tip error:', error)
                    setError('Failed to send tip. Please try again.')
                }
            })
        } catch (err) {
            console.error('Tip error:', err)
            throw new Error('Failed to send tip. Please try again.')
        }
    }

    const handleTip = async () => {
        setError('')
        
        const validation = validateTipRequest()
        if (!validation.isValid) {
            setError(validation.error!)
            return
        }

        try {
            const transaction = buildTipTransaction()
            executeTip(transaction)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send tip. Please try again.')
        }
    }

    const handleClose = useCallback(() => {
        onOpenChange?.({ open: false })
    }, [onOpenChange])

    const resetDialogState = () => {
        setTipAmount('')
        setError('')
        setShowSuccessState(false)
        resetWriteContract()
    }

    const isProcessing = isTipPending || isConfirming

    useEffect(() => {
        if (showSuccessState && open) {
            const timer = setTimeout(() => {
                handleClose()
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [showSuccessState, open, handleClose])


    const handleOpenChange = (details: { open: boolean }) => {
        if (!details.open) {
            resetDialogState()
        }
        onOpenChange?.(details)
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange} size="sm" placement="center">
            <Dialog.Positioner zIndex={50}>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Send a Tip 🧑‍💻</Dialog.Title>
                    </Dialog.Header>
                    
                    <Dialog.Body>
                        <VStack gap={4} align="stretch">
                            {showSuccessState ? (
                                <SuccessState />
                            ) : !isConnected ? (
                                <DisconnectedState onConnect={() => openConnectModal()} />
                            ) : (
                                <TipFormState
                                    balanceInEther={balanceInEther}
                                    isLoadingBalance={isLoadingBalance}
                                    tipAmount={tipAmount}
                                    onTipAmountChange={setTipAmount}
                                    tipAmountInUSD={tipAmountInUSD}
                                    hasNoBalance={hasNoBalance}
                                    inputHasError={inputHasError}
                                    error={error}
                                />
                            )}
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Flex gap={2} width="full">
                            <Button
                                variant="ghost"
                                colorPalette='teal'
                                size="sm"
                                flex={1}
                                onClick={handleClose}
                                disabled={isProcessing || showSuccessState}
                            >
                                {showSuccessState ? 'Closing...' : 'Cancel'}
                            </Button>
                            {!showSuccessState && isConnected && (
                                <Button
                                    colorPalette="teal"
                                    size="sm"
                                    flex={1}
                                    onClick={handleTip}
                                    loading={isProcessing}
                                    disabled={isProcessing || hasNoBalance || hasInsufficientBalance || !tipAmount}
                                >
                                    {isProcessing ? 'Sending...' : 'Send Tip'}
                                </Button>
                            )}
                        </Flex>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

function SuccessState() {
    return (
        <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Description>
                Tip sent successfully! Thank you! 🙏
            </Alert.Description>
        </Alert.Root>
    )
}

function DisconnectedState({ onConnect }: { onConnect: () => void }) {
    return (
        <VStack gap={4} align="center">
            <Text fontSize="md" color="gray.600" textAlign="center">
                You must connect your wallet first
            </Text>
            <Button
                colorPalette="teal"
                size="md"
                onClick={onConnect}
            >
                Connect Wallet
            </Button>
        </VStack>
    )
}

interface TipFormStateProps {
    balanceInEther: string
    isLoadingBalance: boolean
    tipAmount: string
    onTipAmountChange: (_amount: string) => void
    tipAmountInUSD: string | null
    hasNoBalance: boolean
    inputHasError: boolean
    error: string
}

function TipFormState({
    balanceInEther,
    isLoadingBalance,
    tipAmount,
    onTipAmountChange,
    tipAmountInUSD,
    hasNoBalance,
    inputHasError,
    error
}: TipFormStateProps) {
    return (
        <>
            <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                    Your Balance
                </Text>
                <HStack gap={2} align="center">
                    <Image
                        src="/plume-token.webp"
                        alt="PLUME"
                        width="20px"
                        height="20px"
                    />
                    <Text fontSize="md" fontWeight="semibold">
                        {isLoadingBalance ? "Loading..." : `${parseFloat(balanceInEther).toFixed(4)} PLUME`}
                    </Text>
                </HStack>
            </Box>

            <VStack gap={2} align="stretch">
                <Text fontSize="sm" color="gray.600">
                    Amount (PLUME)
                </Text>
                <Input
                    type="number"
                    placeholder="0.1"
                    value={tipAmount}
                    onChange={(e) => onTipAmountChange(e.target.value)}
                    step="0.1"
                    min="0.1"
                    max={balanceInEther}
                    disabled={hasNoBalance}
                    _invalid={{ borderColor: "red.500" }}
                    {...(inputHasError && { "data-invalid": true })}
                />
                {tipAmountInUSD && (
                    <Text fontSize="xs" color="gray.500" textAlign="right">
                        ≈ ${tipAmountInUSD} USD
                    </Text>
                )}
            </VStack>

            {(error || (inputHasError && tipAmount)) && (
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Description fontSize="sm">
                        {error || (hasNoBalance ? "Balance required to send tips" : "Amount exceeds your balance")}
                    </Alert.Description>
                </Alert.Root>
            )}
        </>
    )
}