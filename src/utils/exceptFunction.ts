import { IPermission } from "../model/permission"

export const except = (list: IPermission[], target: string[]): IPermission[] => {
    return list.filter(({ name }) => {
        return target.every(targetName => targetName !== name)
    })
}

export const only = (list: IPermission[], target: string[]): IPermission[] => {
    return list.filter(({ name }) => {
        return target.some(targetName => targetName === name)
    }
    )
}