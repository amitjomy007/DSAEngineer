const Problem = require("../../models/problem");
export const addProblemControl = async (req: any, res: any) => {
    try{
        const problem = new Problem(req.body);
        const existingProblem = await Problem.findOne({title: problem.title});
        const problems = await Problem.find({});
        const numberOfProblems = problems.length + 1;
        if(existingProblem){
            res.status(200).json({message: "Problem already exists"});
            console.log("Problem already exists");
        }
        //const Problem = await Problem.create(problem);
        const problemToBeSaved = {...problem._doc, id: numberOfProblems};
        console.log("PRoblem to be saved: ", problemToBeSaved);
        const newProblem = await Problem.create(problemToBeSaved);
        res.status(200).json({message: "Problem added successfully", problem: newProblem});
    }catch(error){
        console.log("(catched) error occured while trying to upload to database: ", error);
    }
};