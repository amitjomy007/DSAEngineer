const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const dirOutput = path.join(__dirname, "../../../outputs");
if(!fs.existsSync(dirOutput)){
    fs.mkdirSync(dirOutput, { recursive: true });
}
const executeCpp = async (filePath:string)=> {
    const lastString = path.basename(filePath);
    const [jobId,languageExtension] = lastString.split('.');
    const outputFileName = `${jobId}.exe`; 
    const outPath = path.join(dirOutput, `${outputFileName}`); 
    return new Promise((resolve:any, reject:any)=> {
        exec(`g++ ${filePath} -o ${outPath} && cd ${dirOutput} && ${outputFileName}`, (error: any, stdout: string, stderr: string) =>{
            if(error){
                                //error appeared in the code written by us 
                console.error(`Error executing C++ code: ${error.message}`);
                return reject({ message: "Error executing C++ code", error });
            }
                        if (stderr) {
                //error appeared in the code written by the client (asdf.cpp for example)
                //this is not an error in the code written by us
                console.error(`C++ execution stderr: ${stderr}`);
                return reject({ message: "C++ execution error", stderr });
            }
                        console.log(`C++ execution stdout: ${stdout}`);
            resolve(stdout);
        })
    })
}
export default executeCpp;