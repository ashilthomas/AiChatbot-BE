import express from "express"
// import readOpenAi from "../Controllers/openAiController"
import {readOpenAi,getAllHistory, deleteChat, singleChat} from "../Controllers/openAiController"
import clerkAuth from "../middleware/clerkAuth"

const apiChatRouter = express.Router()

apiChatRouter.post('/apireq',clerkAuth,readOpenAi)
apiChatRouter.get('/history',clerkAuth,getAllHistory)
apiChatRouter.delete('/delete/:id',clerkAuth,deleteChat)
apiChatRouter.get('/singleChat/:id',clerkAuth,singleChat)



export default apiChatRouter; 