# Jagra - A task management service for every organization

# V2.0 - ASP.NET Core 3.0, Entity Framework Core, PostgreSQL, React w/ Typescript, Windows 10 UWP Native Client
Active development is now in this new repo. Choice to refactor at this stage is made based on the complexity of the relations in the DB. With Entity Framework and Typescript on the frontend, development should see fewer bugs and improved development speed.

https://github.com/nerocui/jagraV2

----


## Meteor Framework (dev) ##
[Official Site](https://www.meteor.com/)

 - Follow the installatiion steps.
 - Pull the code base
 - Meteor has npm built in, so run
 ```bash
 meteor npm install
 ```
 - Then run
 ```bash
 meteor
 ```
 to build and delpoy to local
  - To run tests
 ```bash
 meteor npm run test
 ```
 - To connect to mongoDB via a GUI software
 Download [Robo 3T](https://robomongo.org/download), and connect to port 3001.
 ![Robo3T](https://github.com/nerocui/screenshots/blob/master/robo3t.jpg?raw=true)
 #
 ## Project Structure
 .meteor -- everything meteor related, like meteor packages, versions, etc.
 
 .vscode -- editor setting, enforce code standard like using tab instead of space.

 client -- where react inject the DOM

 imports -- meteor watches and imports all files and folders in this folder, so most if not all of our code goes in here.
	
- api -- we define and export our database, api (in the form of meteor methods with pure function for business logic) here.
- config -- configuration files, like api keys (prod or beta version will be hosted in server env, local dev key will never be committed), client config (price tier, company meta data, enabled features etc.)
- constant -- one place to manage all static variables like error message, status, API name etc.
- templates -- email notification and log templates for different class of information.
- ui -- React components
- util -- utility functions

 server -- meteor server startup script, can modify if needed
 #
 ## Coding Standard ##
 This project use eslint to ensure a consistent coding style and code quality.
 Please set you editor to use tabs, and install a compatible eslint plugin to give you visual warnings.

 [For Atom](https://atom.io/packages/linter-eslint)

 [For Sublimetext](https://packagecontrol.io/packages/ESLint)
 
 [For VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

 ### Lint Rule
 We use Airbnb's lint rule in this project with some slight modification to avoid losing productivity or having too much boilerplate code.
 
 For reference go to [airbnb's style guide.](https://github.com/airbnb/javascript)

 To see what rules are disabled, refer to .eslintrc.json

#

## Features

Admin dashboard
 - On borading employee
	- By form
	- By importing from csv
	- By importing from json
 - Export/download all company data
 - Track file reference
 - Check logs/activities
 - Create/manage Teams
 - View/handle requests
 - View/edit plan
 - Delete account and be provided the option to download all data

Employee dashboard
 - Overview of tasks assigned, created, team activity, recent files, activities from watched tasks, comments replies, requests
	- Each type is a section, each item in a section is a card with rich info
 - Option to click into detailed pages
	- All assigned tasks
	- All created tasks
	- All watched tasks, option to toggle if it's assigned or created
	- All team member
	- All team activities
	- All files uploaded
		- search by user, file name, team
		- option to view all from self, team, or a specific employee
	- All requests, including made by and to self




