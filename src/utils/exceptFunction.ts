
export const except = (list: string[], target: string[]): string[] => {
    return list.filter(item => !target.includes(item))
}

export const only = (list: string[], target: string[]): string[] => {
    return list.filter(item => target.includes(item))
}