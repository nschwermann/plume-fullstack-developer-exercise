'use client';
import { 
    Card,
    Image,
    Text,
    VStack,
    HStack,
    Skeleton,
    SkeletonCircle,
    SimpleGrid
} from "@chakra-ui/react";
import { useTokenBalances } from "@/hooks/useTokenBalances";

interface BalancesProps {
    walletAddress: string;
}

export function Balances({ walletAddress }: BalancesProps) {
    const { data, isLoading, isError } = useTokenBalances(walletAddress);

    if (isLoading) {
        return (
            <Card.Root p={4} shadow="sm">
                <Text fontWeight="bold" mb={4}>Token Balances</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {[1, 2].map((index) => (
                        <HStack key={index} gap={3}>
                            <SkeletonCircle size="40px" />
                            <VStack align="start" flexGrow={1} gap={1}>
                                <Skeleton height="18px" width="100px" />
                                <Skeleton height="14px" width="60px" />
                            </VStack>
                            <VStack align="end" gap={1}>
                                <Skeleton height="16px" width="80px" />
                                <Skeleton height="14px" width="50px" />
                            </VStack>
                        </HStack>
                    ))}
                </SimpleGrid>
            </Card.Root>
        );
    }

    if (isError) {
        return <Text color="red.500">Failed to load balances</Text>;
    }

    return (
        <Card.Root p={4} shadow="sm">
            <Text fontWeight="bold" fontSize="lg" mb={4}>
                Nest Balance
            </Text>
            <SimpleGrid px={4} columns={{ base: 1, md: 2 }} columnGap={{md : 20, lg: 32, xl: 40}} rowGap={4}>
                {data?.map((balance) => (
                    <HStack key={balance.token.address} gap={3} maxW="390px">
                        <Image src={balance.token.icon_url || '/default_token.webp'} alt='token icon' boxSize="40px" />
                        <VStack align="start" flexGrow={1} gap={0}>
                            <Text fontWeight="bold">{balance.token.name}</Text>
                            <Text color="text">{balance.token.symbol}</Text>
                        </VStack>
                        <VStack align="end" gap={0}>
                            <Text fontWeight='semibold'>{balance.formatted_value}</Text>
                            <Text>${balance.usd_value}</Text>
                        </VStack>
                    </HStack>
                ))}
            </SimpleGrid>
        </Card.Root>
    );
}