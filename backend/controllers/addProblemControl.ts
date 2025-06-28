const Problem = require("../models/problem");
export const addProblemControl = async (req: any, res: any) => {
    try{
        const problem = new Problem(req.body);
        const existingProblem = await Problem.findOne({title: problem.title});
        if(existingProblem){
            res.status(200).json({message: "Problem already exists"});
            console.log("Problem already exists");
        }
        //const Problem = await Problem.create(problem);
        console.log("PRoblem to be saved: ", problem);
        const newProblem = await Problem.create(problem);
        res.status(200).json({message: "Problem added successfully", problem: newProblem});
    }catch(error){
        console.log("(catched) error occured while trying to upload to database: ", error);
    }
};