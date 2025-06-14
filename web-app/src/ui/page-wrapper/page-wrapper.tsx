import { Box } from '@mantine/core'

import styles from './page-wrapper.module.scss'

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box className={styles.wrapper}>
            {children}
        </Box>
    )
}
