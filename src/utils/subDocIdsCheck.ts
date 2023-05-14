import { Model } from 'mongoose'

// 
export const checkIdsInSubDocs = async <T, U>(model: Model<T, U>, docId: string, subDocName: string, subDocItemList: string[]): Promise<boolean | Error> => {
    try {
        const filter = await model.findOne(
            {
                _id: docId,
                [`${subDocName}._id`]: { $in: subDocItemList }
            }
        )
        if (!filter) {
            return new Error(`some  ids of "${subDocName}" are not valid or not exist`)
        }
        const { [subDocName]: subDocItems }: any = filter.toJSON()
        if (subDocItems.length > 0) {
            const subDocIds = subDocItems.map((item: any) => item.id.toString())
            const invalidIds = subDocItemList.filter(id => !subDocIds.includes(id))
            if (invalidIds.length > 0) {
                return new Error(`some  ids of "${subDocName}" are not valid or not exist. lists of invalid ${subDocName}: [${invalidIds}]`)
            }
            // if (!subDocIds.includes(docId)) return new Error(` no "${subDocName}" found with id: [${docId}]`)
        }

        return true
    } catch (error) {
        throw new Error('unexpected error happened while checking ids in sub documents')
    }
}

// sub document operation identifier

export const subDocumentOperationIdentifier = (subDocItems: Record<string, any>[]) => {
    const listsToBeDeleted = subDocItems.filter(obj => (obj.id) && (Object.keys(obj).length < 2))
    const listsToBeUpdated = subDocItems.filter(obj => (obj.id) && (Object.keys(obj).length > 1))
    const listsToBeAdded = subDocItems.filter(obj => !(obj.id) && (Object.keys(obj).length > 0))
    return {
        listsToBeAdded,
        listsToBeUpdated,
        listsToBeDeleted
    }
}