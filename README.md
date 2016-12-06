# while spfx is not in production i'm using this stack to create components in sharepoint

***feel free to fork and change to your needs***

## Usage

`git clone https://github.com/mauricionr/sp-fake-workbench.git`

`cd sp-fake-workbench`

`npm install`

***copy template folder to components folder and rename it. eg: hello-world***

***copy settings.sample.json and rename it to settings.json and add your own info***

`gulp upload --component hello-world`

`gulp watch --component hello-world`

### Demo Structure
    
 - components/
    - hello-world/
 - template/
 - .gitignore
 - gulpfile.js
 - package.json
 - README.md