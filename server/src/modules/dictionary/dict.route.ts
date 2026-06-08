import {Router} from 'express'
import { AppError, asyncHandler } from '../../middleware/error'
import { validateString } from '../../utils/validation'
import { DictService } from './dict.service'
import { sourceMapsEnabled } from 'node:process'

export function createDictRouter(service: DictService) {
    const router = Router()

    router.get('/word', asyncHandler(async (req, res) => {
        const params = req.query
        if(!params) throw new AppError('Require a word for searching','INVALID_WORD',404)

        const rawWord = params.q
        
        const word = validateString(rawWord, 'Word query parameter')

        const result = await service.fetchWordSearch(word)
        if(!result.erorr){
            res.json({
                word: result.word,
                meaning: result.definition
            })
        }
        res.status(404).json({
            error: result.error
        })
    }))

    return router
}