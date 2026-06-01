import { Router } from "express";
import { createWord, lookupWord, getAllWords } from "./vocabulary.service";
import { CreateWordDTO } from "./vocabulary.dto";

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

router.get('/word', async (req, res) => {
  try {
    const result = await lookupWord(req.query.q);
    res.status(200).json(result);
  } catch (err: any) {
    const status = err.statusCode ?? 400;
    res.status(status).json({ error: err.message });
  }
});

router.get('/words', async (req, res) => {
  try {
    const result = await getAllWords();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

