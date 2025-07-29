dockerfile  
docker build -t cpp-compiler .

docker run -it -p 3000:3000 cpp-compiler 



# General Docker Commands
docker images -> display all iamges
docker system prunes -> delete some unused images and some other stuffs




# GuideLines v.0 (AI)  
docker build -t your-image-name .  
docker run -p 8000:8000 your-image-name  

To check running containers  
docker ps  
To stop running containers  
docker stop <container-id>  
To remove container  
docker rm <container-id>  



# VERY IMPORTANT   
    //in windows ./ has to be removed (VERY IMPORTANT VERY IMPORTANT)
    const commmand = `./${outputFileName} < ${inputPath}`;