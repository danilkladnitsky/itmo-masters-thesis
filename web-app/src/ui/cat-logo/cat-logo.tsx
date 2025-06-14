import { Box } from '@mantine/core'
import daimaoLogo from '@/assets/daimao_logo.png'

import styles from './cat-logo.module.scss'
import { cn } from '@/utils/cn'

interface CatLogoProps {
    className?: string
}

export const CatLogo = ({ className }: CatLogoProps) => {
    return (
        <Box className={cn(styles.wrapper, className)}>
            <img src={daimaoLogo} alt='daimao_logo' />
        </Box>
    )
}