import express from "express"
// import readOpenAi from "../Controllers/openAiController"
import {readOpenAi,getAllHistory, deleteChat} from "../Controllers/openAiController"
import clerkAuth from "../middleware/clerkAuth"

const apiChatRouter = express.Router()

apiChatRouter.post('/apireq',clerkAuth, readOpenAi)
apiChatRouter.get('/history',getAllHistory)
apiChatRouter.delete('/delete/:id',deleteChat)
apiChatRouter.post('/createUser',deleteChat)

export default apiChatRouter;