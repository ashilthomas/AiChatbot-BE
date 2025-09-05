import express from "express"
const apiImageRouter = express.Router()

import clerkAuth from "../middleware/clerkAuth"
import { creatImage } from "../Controllers/openAiImageConttroller";
apiImageRouter.post('/createImage',clerkAuth,creatImage)


export default apiImageRouter;