import express, { json } from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app: express.Application = express()

const BOT_URL = process.env.BOT_URL+'/sendMessage'
const PORT = process.env.PORT || 3000

app.use(json())

app.get('/', (req,res) => {
    res.status(200).send('Servicio OK')
})

app.post('/', (req, res) => {
    const isMergeRequest = req.header('x-gitlab-event') === 'Merge Request Hook'
    if(!isMergeRequest){
        res.status(200).send('NOT MR')
        return;
    }
    const gitlabMRURL = req.body.object_attributes.url
    const gitlabMRAction = req.body.object_attributes.action
    const action = (gitlabMRAction === 'reopen' || gitlabMRAction === 'open')? 'abierto' : 'cerrado'
    const userName = req.body.user.name
    try{
        axios.post(BOT_URL,null,{params:
            {
                chat_id:process.env.CHAT_ID,
                text: `<b>${userName}</b>, ha ${action} una MR ${gitlabMRURL}`,
                parse_mode: 'html'
            }
        })
    } catch(e){
        
    }
    res.status(201).send('OK')
})

app.listen(PORT)