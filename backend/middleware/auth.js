import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Token not received!");
            return res.status(401).json({
                message: "User not authenticated."
            });
        }

        // Extract actual token (after "Bearer ")
        const token = authHeader.split(" ")[1];

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);   

        if (!decode) {
            return res.status(401).json({ message: "Invalid token!" });
        }

        // Attach user ID to request object
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Authentication failed!" });
    }
};

export default isAuthenticated;
