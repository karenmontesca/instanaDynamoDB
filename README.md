# I. Introduction
The objetive today is to try and monitor, with Instana, a demo DynamoDB in AWS.

**Important**: If our DynamoDB is in aws-region "A", our EC2 will have to be in aws-region "A" aswell. If there are many DynamoDBs in different regions, an instana agent should be deployed for each region .

There are more manual ways to develop the environment we will work with today, but I have tried to do this with cloudformation so it's faster to deploy and obtain a working environment, as fast and as easily as possible.

This project has a lambda function, the handler is called "index.js". After you clone this repository, you will see the handler, a package.json, and 2 YAML files called "lambda-dynamodb-poc-yaml" and "crear-bucket", don't panic! These YAML will create the rest of our project.

# II. Procedure
### Step 0. Downloading the repository
1. Look for the folder where you keep your projects in your computer, then access it via git Bash.
2. For this example, our folder is called "PRUEBAS" and it is located in:
"D:/PRUEBAS". So to access it via git Bash we can do the following:

```bash
Usuario@EQUIPO-WW MINGW64 ~
$ cd /d

Usuario@EQUIPO-WW MINGW64 /d
$ cd pruebas
```

3. Once having accessed the root folder, clone this repository (hi! that's me)

```bash
git clone http://aquiponemoselrepositorio.com
```

4. When it finishes downloading, you will notice a new folder called "DYNAMOPOC" (aka the root folder of our project), that is the project we will be working with today. Now we just have to access it. In this example, we will do that this way:

```bash
Usuario@EQUIPO-WW MINGW64 /d/pruebas
$ ls                #it's like dir in DOS
dynamopoc/          #this is the new folder that we just cloned

Usuario@EQUIPO-WW MINGW64 /d/pruebas
$ cd dynamopoc

Usuario@EQUIPO-WW MINGW64 /d/pruebas/dynamopoc
$ ls
 crear-bucket.yaml   function.zip               node_modules/
'docu dynam.docx'    imgDoc.docx                package-lock.json
 documentacion.md    index.js                   package.json
 documentacion.sh    lambda-dynamodb-poc.yaml   response.json
```
### Step 1. Installing dependencies and zipping our package
5. You're doing great! Let's keep going. Now we must install the dependencies so our lambda actually works. I already created the project from scratch with npm init -y, so you don't have to. Just follow my lead by copying the following command. Remember we are in the root folder of our project.

```bash
npm install @aws-sdk/client-dynamodb
```

6. Next, we will open our folder on windows. Three different new things just appeared, just confirm they are there: one folder called "node_modules", and a file called "package-lock.json". 
So now, we take the following files and folders, and put them into a zip file called "function":
- index.js
- package-lock.json
- pakage.json
- node_modules

7. Once it's zipped, we are ready for the next step.

### Step 2. Creating our stack in AWS

8. The next few steps are easy. Just copy and paste what I have very kindly prepared for you today. However, in case you make any mistake, I have also provided some commands for you to paste so you can start all over again.

9. With this command we create the bucket we will upload and keep our "function.zip" in:

```bash
# Create bucket
$ aws cloudformation deploy \
  --template-file crear-bucket.yaml \
  --stack-name LambdaCodeBucketStack

#Upload the zip folder to bucket
aws s3 cp function.zip s3://lambda-code-poc-235494811373-us-east-1/function.zip
```

10. Time to deploy in AWS:

```bash
aws cloudformation deploy \
  --template-file lambda-dynamodb-poc.yaml \
  --stack-name LambdaDynamoDBPOCStack \
  --capabilities CAPABILITY_NAMED_IAM
```
11. Obtain the public URL of the API Gateway

```bash
aws cloudformation describe-stacks \
  --stack-name LambdaDynamoDBPOCStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text
```

## Troubleshooting

#### Error. In case there is an error in our deployment, we can use this command to look at the detail of the error

```bash
aws cloudformation describe-stack-events --stack-name LambdaDynamoDBPOCStack
```
#### Delete. Eliminate the stack if there was a failed deployment

```bash
aws cloudformation delete-stack --stack-name LambdaDynamoDBPOCStack
```
https://fo7gp40och.execute-api.us-east-1.amazonaws.com/prod/

### Step 3. Providing IAM permissions to our EC2 instance
11. Log into AWS and go to this address:
https://console.aws.amazon.com/iam/
We click "Roles" on the left navigation bar. Then, we click the button "Create Role" on the top right.

![alt text](https://github.com/karenmontesca/img/IAMRole1.jpg "IAMRole")

12. We select AWS Service as the entity type. For the use case, we select EC2.

![alt text](https://github.com/karenmontesca/img/IAMRole2.jpg "IAMRole")

13. Then we select the permissions to include in this role:

![alt text](https://github.com/karenmontesca/img/IAMRole3.jpg "CloudWatchReadOnlyAccess & AmazonDynamoDBReadOnlyAccess")


