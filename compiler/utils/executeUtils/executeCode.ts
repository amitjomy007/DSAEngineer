
import executeCpp from "./languages/executeCpp";
//identifies the language and feeds to the right compiler util
const executeCode = (filePath : string, language : string) => {
    let output = null;
    switch(language){
        case "cpp":
            output = executeCpp(filePath);
            break;
        // case "javascript":
        //     output = executeJavascript(filePath);
        //     break;
        // case "python":
        //     output = executePython(filePath);
        //     break;
        // case "c":
        //     output = executeC(filePath);
        //     break;
        // case "java":
        //     output = executeJava(filePath);
        //     break;
        default:
            output = executeCpp(filePath);
            break;
    }
    return output;
}
export default executeCode;