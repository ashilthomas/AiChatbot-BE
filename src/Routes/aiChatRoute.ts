import express from "express"
// import readOpenAi from "../Controllers/openAiController"
import {readOpenAi,getAllHistory, deleteChat} from "../Controllers/openAiController"

const apiChatRouter = express.Router()

apiChatRouter.post('/apireq',readOpenAi)
apiChatRouter.get('/history',getAllHistory)
apiChatRouter.delete('/delete/:id',deleteChat)

export default apiChatRouter;