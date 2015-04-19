# dragonrating

Will be updated soon with local setup instuctions. 

Local setup instructions:

1) Download zip or clone this repository to your favorite folder in your system. (If not familiar with github go to https://github.com/aerciyas/dragonrating and scroll to the lower right-hand side of the page). 

2) In the terminal, go to root directory of the project and run 'npm install'. This should add content to a package called node_modules in the root directory of the project. 

3) Again from the terminal, from the root direcotory, go to <root>/src/frontend. Run the command 'bower intall', this will create a package called bower_components in directory <root>/src/frontend. 

4) You will have to set up your own mysql database for the login functionality :( . Otherwise all you will see will be the login page. When you set up your database, do the following below. 
  
  4.1) Find the file <root>/src/backend/userAuth.js
  
  4.2) In there you will find default connection metadata for your own mysql database, something like as follows:
  
  __________________________________________________
  ... some javascript code ...
  
  var connection = mysql.createConnection({
    host: 'your host name',
    user: 'your user name',
    password: 'your password',
    database: 'your database name'
  });
  
  ... some javascript code ... 
   ___________________________________________________
   
   As you can see there are some default values already setup there, you can replace these with whatever credentials
   you have for your own mysql database. 
   
   
   4.3) In your mysql database, run the following to create the user authentication table used in this
   project. 
   ___________________________________________________
   
   CREATE TABLE `<your_schema_name`.`local_user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(225) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC));
   ___________________________________________________

5) Now, back in your terminal, go to the root directory of this project and run 'node src/backend/server.js'. You are done! You should have a localhost running at http://localhost:3000/#/. 
