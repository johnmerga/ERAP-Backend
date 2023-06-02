import moment from "moment";
import { ITenderQuery } from "../model/tender";

export const returnComparedObj = (compare: ITenderQuery): Record<string, any> => {
    if (compare) {
        let comparators = {}
        if (compare.openDate) {
            compare.openDate[0] = compare.openDate[0] ? moment(compare.openDate[0]).toDate() : moment().add(-100, 'years').toDate()
            compare.openDate[1] = compare.openDate[1] ? moment(compare.openDate[1]).toDate() : moment().add(100, 'years').toDate()
            comparators = {
                ...comparators,
                openDate: [compare.openDate[0], compare.openDate[1]]
            }
        }
        if (compare.bidDeadline) {
            compare.bidDeadline[0] = compare.bidDeadline[0] ? moment(compare.bidDeadline[0]).toDate() : moment().add(-100, 'years').toDate()
            compare.bidDeadline[1] = compare.bidDeadline[1] ? moment(compare.bidDeadline[1]).toDate() : moment().add(100, 'years').toDate()
            comparators = {
                ...comparators,
                bidDeadline: [compare.bidDeadline[0], compare.bidDeadline[1]]
            }
        }
        if (compare.closeDate) {
            compare.closeDate[0] = compare.closeDate[0] ? moment(compare.closeDate[0]).toDate() : moment().add(-100, 'years').toDate()
            compare.closeDate[1] = compare.closeDate[1] ? moment(compare.closeDate[1]).toDate() : moment().add(100, 'years').toDate()
            comparators = {
                ...comparators,
                closeDate: [compare.closeDate[0], compare.closeDate[1]]
            }
        }
        if (compare.price) {
            compare.price[0] = compare.price[0] ? compare.price[0] : 0
            compare.price[1] = compare.price[1] ? compare.price[1] : Number.MAX_SAFE_INTEGER
            comparators = {
                ...comparators,
                price: [compare.price[0], compare.price[1]]
            }
        }
        return comparators
    }
    return {}
}