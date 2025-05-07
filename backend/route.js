import express from 'express'
import upload from './middleware.js'
import { register,login,journalentry,getjournalentry,editjournalentry,deletejournalentry,moodentry,getmoodentry,addgoal,getgoals,deletegoal,updategoal,userprofile,updateprofile,deleteprofileimage,aisummary,chatbotResponse,getMonthlyUsers,getWeeklyUsers,getWeeklyUserGrowth,getUsers,updatedUser,deleteUser} from './controller.js'

const route=new express.Router()

route.post('/register',register)
route.post('/login',login)
route.post('/journalentry',journalentry)
route.get('/getjournalentry',getjournalentry)
route.put('/editjournalentry',editjournalentry)
route.delete('/deletejournalentry/:id',deletejournalentry)
route.post('/getmoodentry',getmoodentry)
route.post('/moodentry',moodentry)
route.post('/addgoal',addgoal)
route.get('/getgoals',getgoals)
route.delete('/deletegoal/:id',deletegoal)
route.put("/updategoal/:id", updategoal);
route.post('/userprofile',userprofile)
route.post('/updateprofile', upload.single('profileimage'), updateprofile);
route.post('/deleteprofileimage',deleteprofileimage)
route.post('/aisummary',aisummary)
route.post("/chatbot", chatbotResponse);
route.get("/monthly-users", getMonthlyUsers);
route.get("/weekly-users", getWeeklyUsers);
route.get("/weekly-user-growth", getWeeklyUserGrowth);
route.get('/getUsers',getUsers)
route.put('/updatedUser/:id',updatedUser)
route.delete('/deletedUser/:id',deleteUser)

export default route