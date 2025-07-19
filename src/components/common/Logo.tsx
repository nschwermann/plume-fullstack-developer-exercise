import { Image } from "@chakra-ui/react"

interface LogoProps {
  width?: string | number
  height?: string | number
}

export function Logo({ width = "87px", height = "32px" }: LogoProps) {
  return (
    <Image
      src="/nest-logo.svg"
      alt="Nest"
      width={width}
      height={height}
    />
  )
}