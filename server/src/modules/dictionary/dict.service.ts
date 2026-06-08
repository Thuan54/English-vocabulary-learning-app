import { raw } from "express";

export class DictService {
    private apiUrl : string | undefined

    constructor(){
        this.apiUrl = process.env.DICT_API_URL
        if (!this.apiUrl) {
            throw new Error('DICT_API_URL is not defined in environment variables')
        }
    }

    async fetchWordSearch(word: string) {
        const result = await fetch(this.apiUrl + '?word=' + word)
        const rawWord = await result.json();
        const definition = await fetch(process.env.TRANSLATE_URL + rawWord.definition)
        const translate = (await definition.json())
        rawWord.definition = translate[0]

        return rawWord
    }
}