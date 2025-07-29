dockerfile  
docker build -t cpp-compiler .

docker run -it -p 9000:3000 cpp-compiler 



# General Docker Commands
docker images -> display all iamges
docker system prunes -> delete some unused images and some other stuffs


