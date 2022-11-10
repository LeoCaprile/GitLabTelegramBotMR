"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv.config();
const app = (0, express_1.default)();
const BOT_URL = process.env.BOT_URL + '/sendMessage';
const PORT = process.env.PORT || 3001;
const MERGE_ACTION = {
    open: 'abierto',
    reopen: 're-abierto',
    approved: 'aprobado',
    closed: 'cerrado',
    update: 'actualizado',
    unapproved: 'desaprobado',
    approval: 'aprobado',
    unapproval: 'desaprobado',
    merge: 'mergeado'
};
app.use((0, express_1.json)());
app.get('/', (req, res) => {
    res.status(200).send('Servicio OK');
});
app.post('/', (req, res) => {
    const isMergeRequest = req.header('x-gitlab-event') === 'Merge Request Hook';
    if (!isMergeRequest) {
        res.status(200).send('NOT MR');
        return;
    }
    const gitlabMRURL = req.body.object_attributes.url;
    const gitlabMRAction = req.body.object_attributes.action;
    const action = MERGE_ACTION[gitlabMRAction];
    const userName = req.body.user.name;
    try {
        axios_1.default.post(BOT_URL, null, { params: {
                chat_id: process.env.CHAT_ID,
                text: `<b>${userName}</b>, ha ${action} una MR ${gitlabMRURL}`,
                parse_mode: 'html'
            }
        });
    }
    catch (e) {
    }
    res.status(201).send('OK');
});
app.post('/cleanServer', (req, res) => {
    try {
        axios_1.default.post(BOT_URL, null, { params: {
                chat_id: process.env.CHAT_ID,
                text: `<h1>Realizando limpieza en el servidor....</h1>`,
                parse_mode: 'html'
            }
        });
        res.status(200).send('OK');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('OK');
    }
});
app.listen(PORT, () => { console.log('Listening on port ', PORT); });
