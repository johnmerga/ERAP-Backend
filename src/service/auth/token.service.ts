import { TokenDal } from "../../dal/token"
import { TokenQuery } from "../../model/token"

export class TokenService {
    private tokenDal: TokenDal
    constructor() {
        this.tokenDal = new TokenDal()
    }
    // public async createToken(token: any) {
    //     return await this.tokenDal.createToken(token)
    // }
    public async findToken(query: TokenQuery) {
        return await this.tokenDal.findToken(query)
    }
    // public async deleteToken(query: any) {
    //     return await this.tokenDal.deleteToken(query)
    // }
}

