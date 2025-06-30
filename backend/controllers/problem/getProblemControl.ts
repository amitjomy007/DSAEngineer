const Problem = require("../../models/problem");
export const getProblemControl = async (req: any, res: any) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json(problems);
  } catch (error) {
    console.log(
      "(catched) error occured while trying to upload to database: ",
      error
    );
  }
};
