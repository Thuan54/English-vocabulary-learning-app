import { Router } from "express";
import { createWord } from "./vocabulary.service";

const router = Router();

router.post("/word", async (req, res) => {

  try {

    const result = await createWord(req.body);

    res.status(201).json(result);

  } catch (err: any) {

    res.status(400).json({
      error: err.message
    });

  }

});


export default router;