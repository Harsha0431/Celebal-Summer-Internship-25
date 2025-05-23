import dotenv from "dotenv";

dotenv.config();

const envConfig = {
    PORT: process.env.PORT || 5431,
}

export default envConfig;
