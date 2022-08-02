
// PACKAGE REQUIREMENTS
const inquirer = require('inquirer');
const generateMarkdown = require('./utils/generateMarkdown');
const fs = require('fs');


// QUESTION TEMPLATE
class Question{
    constructor(type, name, message, otherPropertiesObj){
        this.type = type;
        this.name = name;
        this.message = message;

        for (const property in otherPropertiesObj)
            this[property] = otherPropertiesObj[property];
    }

    static validator(input, errMsg){
        if (input)
            return true;
        
        console.log('  * ' + errMsg);
        return false;
    }
}


// QUESTIONS
const TAB = '    '; //4 spaces

const questionsBatch1 = [
    new Question(
        'input',
        'title',
        'What is the title of your project?',
        {validate: input => Question.validator(input, "Please enter your project's title!")}),
    new Question(
        'input',
        'desc',       
        `Provide a description of your project
${TAB}(Why did you build this project?)
${TAB}(How did you build it?)
${TAB}(What problem does it solve?)
:`      ,
        {validate: input => Question.validator(input, 'Please enter a description of your project!')}),
    new Question(
        'confirm',
        'confirmTOC',
        'Do you want to include a table of contents?',
        {default: true}),
    new Question(
        'confirm',
        'confirmInstallInstructions',
        'Do you want to include install instructions?',
        {default: false}),
];


const installSteps = () => new Promise((resolve) => {
    let stepsCounter = 0;
    let steps = [];

    const getStep = () =>
        inquirer.prompt([new Question(
            'input',
            'step',
            `${TAB}- Enter install instructions for Step #${++stepsCounter} (or enter 'done'):`,
            {validate: input => Question.validator(input, `Please enter text for Step #${stepsCounter}!`)}
        )])
            .then(({step}) => {
                if (step !== 'done'){
                    steps.push(step);
                    getStep();
                }else
                    resolve({'installSteps': steps});
            })
        ;

    getStep(); //Gets Step #1, and calls recursively for further steps (until user types 'done')
});


const questionsBatch2 = [
    
];








    
// TODO: Create a function to write README file
const writeToFile = (fileName, data) => {

};

// TODO: Create a function to initialize app
const init = () => {
    installSteps()
        .then(results => console.log(results));
};


// INITIALIZE
init();
