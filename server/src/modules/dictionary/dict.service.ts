import { WordInputDTO } from "../word/word.dto"

export class DictService {
    private apiUrl : string | undefined

    constructor(){
        this.apiUrl = process.env.DICT_API_URL
        if (!this.apiUrl) {
            throw new Error('DICT_API_URL is not defined in environment variables')
        }
    }

    async fetchWordSearch(word: string) {
        return await fetch(this.apiUrl + '?word=' + word)
    }
}