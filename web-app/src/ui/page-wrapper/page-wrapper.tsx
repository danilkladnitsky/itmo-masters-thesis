import { Box } from '@mantine/core'

import styles from './page-wrapper.module.scss'
import { cn } from '@/utils/cn'

export const PageWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <Box className={cn(styles.wrapper, className)}>
            {children}
        </Box>
    )
}
