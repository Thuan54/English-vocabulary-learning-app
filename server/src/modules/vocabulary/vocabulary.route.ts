import {Router} from "express"
import {getAllWords} from "./vocabulary.service"

const router = Router()

router.get('/',async(req,res) => {
    const words = await getAllWords();
})

export default router