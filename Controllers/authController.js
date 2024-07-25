import UserModel from '../Models/UserModel.js';
import bcrypt from 'bcrypt';
import { responseReturn } from '../utils/response.js';
import { createTokens } from '../utils/tokenCreate.js';

class AuthControllers {

    // User Login Function
    userLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                responseReturn(res, 400, { error: 'All fields are required' });
                return;
            }

            const user = await UserModel.findOne({ email }).select('+password');
            if (!user) {
                responseReturn(res, 401, { error: "Email doesn't exist" });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                responseReturn(res, 401, { error: 'Invalid password' });
                return;
            }

            const tokens = createTokens({ id: user.id, email: user.email });
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            responseReturn(res, 200, { accessToken: tokens.accessToken, message: "Login Successful" });

        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    userRegister = async (req, res) => {
        const { email, password } = req.body;
        try {
            const getUser = await UserModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                const user = await UserModel.create({
                    email,
                    password: await bcrypt.hash(password, 10),
                });

                const tokens = createTokens({ id: user.id, email: user.email });
                res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                responseReturn(res, 200, { accessToken: tokens.accessToken, message: "Register Successful" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }

    logout = async (req, res) => {
        try {
            res.cookie('refreshToken', null, { expires: new Date(Date.now()), httpOnly: true });
            res.status(200).json({ message: "Logout Successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

// Export an instance of the AuthControllers class
export default new AuthControllers();
