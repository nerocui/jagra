# jagra
## Meteor ##
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

 
