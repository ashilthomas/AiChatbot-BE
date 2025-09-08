import express from "express"
// import readOpenAi from "../Controllers/openAiController"
import {readOpenAi,getAllHistory, deleteChat, singleChat, credits} from "../Controllers/openAiController"
import clerkAuth from "../middleware/clerkAuth"

const apiChatRouter = express.Router()

apiChatRouter.post('/apireq',clerkAuth,readOpenAi)
apiChatRouter.get('/history',clerkAuth,getAllHistory)
apiChatRouter.delete('/delete/:id',clerkAuth,deleteChat)
apiChatRouter.get('/singleChat/:id',clerkAuth,singleChat)
apiChatRouter.get('/credits',clerkAuth,credits)


export default apiChatRouter; 