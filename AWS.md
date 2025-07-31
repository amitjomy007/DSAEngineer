DOCKER BUILD COMMANDS
docker build -t cpp-compiler .
docker run -it -p 3000:3000 cpp-compiler

Bash
AWS Configure
access key : check local dummy env
secrete access key :check local dummy env
region : press enter
output : json

ECR Setup

Go to Repositories and select repo  
Then see "View push commands"  
Apply them all in terminal to push to ECR (use bash)

EC2 Setup
Launch EC2 isntance (or create if it doesn't exist)
use Connect Button to view commands to connect in bash/ssh
If you have old docker images causing storage to go low follow these
df -h : to see how much is used, note the value down
docker system -df to see what is taking space in docker  
WARNING these commands may delete, so read till Marked lcoation below
docker container prune -f if container is taking space
docker image prune -f to remove all images
docker image prune -a -f more aggressive
if you want to delete only specific , there are cmds for thatt
you can check those cmds and execute as needed
Marked Location reached, you can go bck

NOw we have clened our ec2 (if required)

now lets pull docker image from ecr if it's not yet pulled
docker pull <imagename>
use image URI in imagename place

errors may come, read them and do necessary changes (can't write anything, it can vary everytime)

now docker images

docker run -p 3000:3000 your-image-name  
youn cn use image id also instead of name
