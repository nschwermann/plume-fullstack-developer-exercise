'use client';
import {
    Table,
    Text,
    Image,
    Box,
    Flex,
    Spinner,
    Button,
    Icon,
    Card,
    Skeleton,
    useBreakpointValue
} from "@chakra-ui/react";
import Link from "next/link";
import { formatHex } from "@/utils/formatters";
import { UserAvatar } from "@/components/common/Avatar";
import { EnrichedTokenTransferItem } from "@/schemas/token-transfers";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { useTokenTransfers } from "@/hooks/useTokenTransfers";

interface TransactionsProps {
    walletAddress: string;
}

export function Transactions({ walletAddress }: TransactionsProps) {

    const isSmall = useBreakpointValue({ base: true, md: false });

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useTokenTransfers(walletAddress);

    const formatAddress = (address: EnrichedTokenTransferItem['from'] | EnrichedTokenTransferItem['to']) => {
        if (address.ens_domain_name) return address.ens_domain_name;
        if (address.name) return address.name;
        return formatHex(address.address);
    };

    const renderAddressWithIcon = (address: EnrichedTokenTransferItem['from'] | EnrichedTokenTransferItem['to']) => {
        
        return (
            <Link href={`/address/${address.address}`} passHref>
                <Flex align="center" gap={2} _hover={{ textDecoration: "underline" }} cursor="pointer">
                    {address.is_contract ? (
                        <Icon as={FiFileText} boxSize={4} color="gray.500" />
                    ) : (
                        <UserAvatar walletAddress={address.address} size={6} />
                    )}
                    <Text truncate maxWidth={{ base: '60px', md: '75px', lg: '150px' }} fontFamily={'mono'} fontSize="sm">{formatAddress(address)}</Text>
                </Flex>
            </Link>
        );
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (isError) {
        return (
            <Text color="red.500" textAlign="center">
                Error loading transactions: {error.message}
            </Text>
        );
    }

    const allTransactions = data?.pages.flatMap(page => page.items) ?? [];

    return (
        <Card.Root mt={8} p={1} boxShadow="sm">
            <Text pl={2} fontWeight="bold" fontSize="lg">Transaction History</Text>
            <Box overflowX="auto">
                <Table.Root size="sm" variant="line" minWidth={isSmall ? "500px" : "600px"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Transaction Hash</Table.ColumnHeader>
                            <Table.ColumnHeader>Transfer</Table.ColumnHeader>
                            <Table.ColumnHeader>Token</Table.ColumnHeader>
                            <Table.ColumnHeader>Amount</Table.ColumnHeader>
                            <Table.ColumnHeader>Time</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonRow key={index} index={index} isSmall={isSmall ?? false} />
                        ))
                    ) : (
                        allTransactions.map((transaction, index) => (
                            <TransactionRow
                                key={`${transaction.transaction_hash}-${index}`}
                                transaction={transaction}
                                index={index}
                                isSmall={isSmall ?? false}
                                renderAddressWithIcon={renderAddressWithIcon}
                                formatTimestamp={formatTimestamp}
                            />
                        ))
                    )}
                </Table.Body>
            </Table.Root>
            </Box>

            {hasNextPage && (
                <Flex justify="center" my={4}>
                    <Button
                        colorPalette="teal"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="ghost"
                    >
                        {isFetchingNextPage ? (
                            <Flex align="center" gap={2}>
                                <Spinner size="sm" />
                                Loading more...
                            </Flex>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </Flex>
            )}

            {allTransactions.length === 0 && !isLoading && (
                <Text textAlign="center" py={8} color="text.muted">
                    No transactions found
                </Text>
            )}
        </Card.Root>
    );
}

interface TransactionRowProps {
    transaction: EnrichedTokenTransferItem;
    index: number;
    isSmall: boolean;
    renderAddressWithIcon: (_address: EnrichedTokenTransferItem['from'] | EnrichedTokenTransferItem['to']) => React.JSX.Element;
    formatTimestamp: (_timestamp: string) => string;
}

interface SkeletonRowProps {
    index: number;
    isSmall: boolean;
}

function SkeletonRow({ index, isSmall }: SkeletonRowProps) {
    return (
        <Table.Row key={`skeleton-${index}`}>
            <Table.Cell>
                <Skeleton height="20px" width="120px" />
            </Table.Cell>
            <Table.Cell>
                <Flex align="center" gap={3} minWidth={isSmall ? "150px" : "200px"}>
                    <Flex align="center" gap={2}>
                        <Skeleton borderRadius="full" width="24px" height="24px" />
                        <Skeleton height="16px" width="80px" />
                    </Flex>
                    <Skeleton width="16px" height="16px" />
                    <Flex align="center" gap={2}>
                        <Skeleton borderRadius="full" width="24px" height="24px" />
                        <Skeleton height="16px" width="80px" />
                    </Flex>
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Flex align="center" gap={2}>
                    <Skeleton borderRadius="full" width="25px" height="25px" />
                    <Skeleton height="16px" width="60px" />
                </Flex>
            </Table.Cell>
            <Table.Cell textAlign="end">
                <Skeleton height="16px" width="80px" ml="auto" />
            </Table.Cell>
            <Table.Cell>
                <Skeleton height="16px" width="120px" />
            </Table.Cell>
        </Table.Row>
    );
}

function TransactionRow({ 
    transaction, 
    index, 
    isSmall, 
    renderAddressWithIcon, 
    formatTimestamp 
}: TransactionRowProps) {
    return (
        <Table.Row key={`${transaction.transaction_hash}-${index}`}>
            <Table.Cell>
                <Text fontFamily="mono" fontSize="sm">
                    {formatHex(transaction.transaction_hash)}
                </Text>
            </Table.Cell>
            <Table.Cell>
                <Flex align="center" gap={3} minWidth={isSmall ? "150px" : "200px"}>
                    {renderAddressWithIcon(transaction.from)}
                    <Icon as={FiArrowRight} boxSize={4} color="gray.400" />
                    {renderAddressWithIcon(transaction.to)}
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Flex align="center" gap={2}>
                    <Image
                        src={transaction.token.icon_url}
                        alt={transaction.token.name}
                        width="25px"
                        height="25px"
                        borderRadius="full"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    {!isSmall && <Text fontSize="sm">{transaction.token.name}</Text>}
                </Flex>
            </Table.Cell>
            <Table.Cell>
                <Text fontSize="sm" fontWeight="medium">
                    {transaction.formatted_amount}
                </Text>
            </Table.Cell>
            <Table.Cell>
                <Text fontSize="sm" color="color.subtle">
                    {formatTimestamp(transaction.timestamp)}
                </Text>
            </Table.Cell>
        </Table.Row>
    );
}