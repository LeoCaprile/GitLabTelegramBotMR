import express, { json } from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app: express.Application = express()

const BOT_URL = process.env.BOT_URL+'/sendMessage'
const PORT = process.env.PORT || 3001

const MERGE_ACTION: {[key:string]:string} = {
    open: 'abierto',
    reopen: 're-abierto',
    approved: 'aprobado',
    closed: 'cerrado',
    update: 'actualizado',
    unapproved: 'desaprobado',
    approval: 'aprobado',
    unapproval: 'desaprobado',
    merge: 'mergeado'
}

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
    const gitlabMRAction:string = req.body.object_attributes.action
    const action:string = MERGE_ACTION[gitlabMRAction]
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

app.post('/cleanServer', (req,res) => {
    try{
        axios.post(BOT_URL,null,{params:
            {
                chat_id:process.env.CHAT_ID,
                text: `<b>Realizando limpieza en el servidor....</b>`,
                parse_mode: 'html'
            }
        })
    res.status(200).send('OK')

    } catch(e){
        console.log(e)
    res.status(500).send('OK')

    }
})

app.listen(PORT, ()=> {console.log('Listening on port ', PORT)})