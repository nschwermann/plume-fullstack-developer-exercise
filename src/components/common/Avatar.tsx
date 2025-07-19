import avatar from 'gradient-avatar'
import { Avatar, Image, ClientOnly } from '@chakra-ui/react'
import { ComponentProps} from 'react'

interface AvatarWithFallbackProps {
    walletAddress?: string
}

export function UserAvatarWithFallback({ walletAddress }: AvatarWithFallbackProps) {

    //Normally we would normalize the address to lower case but the plume block explorer does not so it will look the same
    const gradient = walletAddress ? avatar(walletAddress) : undefined;  
    const avatarSrc = gradient ? `data:image/svg+xml;utf8,${encodeURIComponent(gradient)}` : undefined;

    return(
        <Avatar.Root colorPalette='teal' shape="full" size='sm'>
            <Avatar.Fallback/>
            {avatarSrc && <ClientOnly>{() => <Avatar.Image src={avatarSrc} alt="User Avatar" />}</ClientOnly>}
        </Avatar.Root>
    )
}

interface AvatarProps {
    walletAddress: string
    size?: number 
}

export function UserAvatar({ walletAddress, size = 24 }: AvatarProps & ComponentProps<typeof Avatar.Root>) {

    const gradient = walletAddress  ? avatar(walletAddress, size) : undefined;  
    const avatarSrc = gradient ? `data:image/svg+xml;utf8,${encodeURIComponent(gradient)}` : undefined;
    
    return (
        <Image
            src={avatarSrc}
            alt="User Avatar"
            boxSize={size}
            borderRadius="full"
            objectFit="cover"
        />
    )
}
