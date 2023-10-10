import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";

 dotenv.config();

const app: Express = express();
const port =  process.env.PORT ||5001;
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Server '+port)
});
app.get('/kategoriler', (req: Request, res: Response) => {
    const search=req.query['search'] as string;
   const data=require('./items.json') as Array<string>;
   res.status(200).send(data.filter(x=>x.toLowerCase().includes(search.toLowerCase())))
});

app.listen(port, () => {
  console.log(` Server is running at http://localhost:${port}`);
});