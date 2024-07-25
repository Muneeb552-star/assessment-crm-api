import jwt from 'jsonwebtoken';

export const createTokens = (data) => {
    // Generate access token
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
    
    // Generate refresh token
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
    
    return { accessToken, refreshToken };
};
