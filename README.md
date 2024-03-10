#clone the repository to run the application

#Go to root directory and open terminal

# run command npm i

# change name of the file from .env.example  to .env  and add your cluster MONGO_CONNECTION_URL to connect with the data base

# run command npm start

#  server will be listening on port : 3000 (localhost)

# open browser tab and hit the base URL provided in the .env file

#now try to login with the credentials:{username:"admin",password:"pass"} ---> click button login

#Now again got to base URL without doing logout   ---> it will not send you on the login page but you can be there on the logged in page only this is what exactly the secure localStrategy of the passport authentication

#click logout and now you can login 

# Hope it will be useful for the beginner

##regards Akshay Prajapati
