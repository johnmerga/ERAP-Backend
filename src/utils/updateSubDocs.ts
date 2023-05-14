import { Model } from "mongoose";

export enum Operation {
    ADD = 'add',
    DELETE = 'delete',
    UPDATE = 'update'
}

interface IUpdateSubDocuments {
    id?: string,
    update?: Partial<any>
}

export async function updateSubDocuments<T, U>(
    model: Model<T, U>,
    docId: string,
    subDocName: string,
    subDocUpdates: IUpdateSubDocuments[],
    operation: Operation
): Promise<T | Error> {
    let bulkOps: any = []
    switch (operation) {
        case Operation.ADD:
            bulkOps = subDocUpdates.map(({ id, update }) => ({
                updateOne: {
                    filter: {
                        _id: docId,
                    },
                    update: {
                        $push: {
                            [subDocName]: update
                        }
                    },
                },
            }))
            break;
        case Operation.UPDATE:
            bulkOps = subDocUpdates.map(({ id, update }) => ({
                updateOne: {
                    filter: {
                        _id: docId,
                        [`${subDocName}._id`]: id,
                    },
                    update: {
                        [`${subDocName}.$`]: update,
                    },
                },
            }))
            break;
        case Operation.DELETE:
            bulkOps = subDocUpdates.map(({ id, update }) => ({
                updateOne: {
                    filter: {
                        _id: docId,
                    },
                    update: {
                        $pull: {
                            [subDocName]: {
                                _id: id
                            }
                        }
                    },
                },
            }))
            break;
        default:
            return new Error('invalid operation')
    }

    if (bulkOps.length === 0 || bulkOps === null || bulkOps === undefined) {
        return new Error(`bulkOps is empty or undefined: error happened while updating sub-documents: "${subDocName}"`)
    }

    const result = await model.bulkWrite(bulkOps)
    if (result.modifiedCount !== subDocUpdates.length) {
        if (result.modifiedCount === 0) return new Error(`no ${subDocName} sub-documents were updated`)
        return new Error(`only ${result.modifiedCount} of ${subDocName} sub-documents were updated`)

    }
    // return updated sub-documents
    const updatedSubDocs = await model.findById(docId)
    if (!updatedSubDocs) {
        return new Error(`unable to find document with id: "${docId}"`)
    }
    return updatedSubDocs
}
