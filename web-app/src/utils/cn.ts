// cn function
export const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
}
