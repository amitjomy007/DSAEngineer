
const dotenv = require("dotenv");
dotenv.config();
import axios from "axios";
const compilerBackendUrl = process.env.COMPILER_BACKEND_URL || "localhost:3000/run";

export const judgeControl = async (req: any, res: any)  => {
    let output = undefined;
    const {language,code} = req.body;
    console.log("received language and code are : ", language, code);
    const payload = { language,code };
    
    try{
        
        output = await axios.post(`http://${compilerBackendUrl}`, payload);
        // console.log("output is: ", output);
        res.status(200).json(output.data);
    }
    catch(err){
        console.log("Catched error in backend server: ", err);
        res.status(500).json(err);
    }
};