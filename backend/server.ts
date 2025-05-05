import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const env = require('dotenv').config()

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser())
app.use(express.json({limit: '10mb'}));

let currentUser : IUser | null
const genAI = new GoogleGenerativeAI("AIzaSyASScwoSxNvJ97BpYc-jpJrC-wWPNCNyFQ");
mongoose.connect('mongodb://127.0.0.1:27017/busterDB')
const schema = new mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  id: {type: String, required: true},
  chatHistory: {
    type: [{ role: String, content: String, time: Date, id: Number }],
    required: true  
  },
  profileImage: {type: String},
  hourlyLimit: {type: Number}
})
const mongo = mongoose.model('buster', schema)

app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, id} = req.body as { message: string; id: string };
    const user: any = await mongo.findOne({id})
    const model: GenerativeModel = genAI.getGenerativeModel({ model: `gemini-2.0-${user?.hourlyLimit == 0 ? 'flash-lite' : 'flash'}` });
    if (!message) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    const systemMessage = `
      You are a homework help assistant named Buster, provide moderate sized and detailed answers. Only respond to questions related to school subjects such as math, science, history, or assignments, respond to even the most basic things about them. 
    `;

    let chatContext = `${systemMessage}\n\nUser: ${message}\n`;

    for (const msg of user.chatHistory) {
      chatContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }

    const result = await model.generateContent(chatContext);
    const response = result.response.text().replace(/\*/g, '');

    if(currentUser?.chatHistory){
      user.chatHistory.push({ role: 'user', content: message, time: new Date(), id: user.chatHistory.length });
      user.chatHistory.push({ role: 'assistant', content: response, time: new Date(), id: user.chatHistory.length });
    }
    let decrementedAIUses = user.hourlyLimit !== 0 && user.hourlyLimit - 1
    user.hourlyLimit = decrementedAIUses
    await user.save()
    res.json({
      message: response,
      history: user.chatHistory
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

interface IUser {
  id?: string
  name?: string,
  password?: string,
  email?: string,
  chatHistory?: [{
    role: String,
    content: String,
    time: Date,
    id: Number
  }],
  profileImage?: String,
  hourlyLimit: Number
}
interface Message {
  role: "user" | "assistant";
  content: String;
  timestamp: Date;
  id: Number
}

app.post('/sign-up', async (req: Request, res: Response) => {
  const {name, password, email, id, hourlyLimit} = req.body
  const emailExists = await mongo.findOne({email})
  const nameExists = await mongo.findOne({name})
  if(emailExists || nameExists){
      return res.status(404).json({error: 'User exists. Try a different one.'})
  }
  const user = new mongo({
      name,
      password: await bcrypt.hash(password, 15),
      email,
      id,
      hourlyLimit,
      profileImage: ''
  })
  await user.save()
  return res.status(201).send({success: true, message: 'Account created succesfully'})
  
}) 
app.post('/sign-in', async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body
    const userExists = await mongo.findOne({email})
    const passwordIsReal = await bcrypt.compare(password, userExists.password)
    const token = jwt.sign({id: userExists.id, email: userExists.email}, process.env.JWT_TOKEN, {expiresIn: '24h'})

    if (!userExists) {
      return res.status(404).json({ message: "Email not found bro." });
    }
    if (!passwordIsReal) {
      return res.status(401).json({ message: "Incorrect password bro." });
    }

    currentUser = userExists
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24
    })

    setTimeout(() => {
      currentUser = null
    }, 60 * 60 * 1000 * 48);
    if(passwordIsReal && userExists && userExists.email == email){
      return res.status(200).json({currentUser, token})
    }
  }catch(error){
    return res.status(500).json({message: 'Incorrect email or server issue. Check back later!'})
  }
})
app.get('/verify-token', async (req: Request, res: Response) => {
  const token = req.cookies.token
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN) as { id: string };
    const user = await mongo.findOne({ id: decoded.id });
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});
app.post('/sign-out', async (req: Request, res: Response) => {
  const token = req.cookies.token
  try{
    res.clearCookie("token", {
      sameSite: 'lax',
      secure: false,
      httpOnly: true
    })
    currentUser = null
    return res.status(200).json({currentUser, token})
  }catch(error){
    console.log(error)
    return res.status(500).json({message: 'Unable to sign out.'})
  }
})
app.patch('/rewind/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const {userId} = req.body
  
  try{
    const user = await mongo.findOne({id: userId})
    if(!user.chatHistory){
      return res.status(404).json({message: 'No chat history'})
    }
    user.chatHistory = user.chatHistory.filter((message: Message) => Number(message.id) <= Number(id))
    await user.save()
    return res.status(200).json(user.chatHistory)
  }catch(error){
    console.log(error)
    return res.status(500).json({message: 'Unable to rewind.'})
  }
})
app.delete('/account-deletion/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  try{
    const user = await mongo.deleteOne({id})
    currentUser = null
    if(user){
      return res.status(200).json(user)
    }
  }catch(error){
    console.log(error)
    return res.status(500).json({message: 'Unable to delete account.'})
  }
})
app.patch('/change-password/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const user = await mongo.findOne({id})
  const {password, newPassword} = req.body
  try{
    const correctPassword = await bcrypt.compare(password, user.password)
    if(!correctPassword){
      return res.status(404).json({message: 'The password doesnt match'})
    }
    user.password = await bcrypt.hash(newPassword, 15)
    await user.save()
  }catch(error){
    console.log(error)
    return res.status(500).json({message: 'Unable to sign out.'})
  }
})
app.patch('/change-profile/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const {username, profileImage} = req.body
  const user = await mongo.findOne({id})

  try{
    user.name = username
    user.profileImage = profileImage
    await user.save()
    return res.status(200).json(user)
  }catch(error){
    console.log(error)
  }
})
app.patch('/hourly-reset', async (req: Request, res: Response) => {
  try{
    const {id} = req.body
    const user = await mongo.findOne({id})
    user.hourlyLimit = 10
    await user.save()
    return res.status(200).send(user)
  }catch(error){
    console.log(error)
    return res.status(500).json({message: 'Error resetting BusterAI quotas.'})
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
