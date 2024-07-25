import dotenv from 'dotenv';
import express from 'express';
// import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { dbConnect } from './utils/dbConnect.js';
import cors from 'cors';
import http from 'http';


dotenv.config();

const app = express();
const server = http.createServer(app);

//.env variables
const port = process.env.PORT || 4000;

// Calling the DbConnect Function to start connection
dbConnect();

// Enable CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this specific origin
    credentials: true
}));


// Middleware function parse incoming requests 
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cookieParser());

// Client Route handlers
import authRoutes from './Routes/authRoutes.js';
import productRoutes from './Routes/productRoutes.js';


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server http://localhost:
server.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
