
// PACKAGE REQUIREMENTS
const inquirer = require('inquirer');
const generateMarkdown = require('./utils/generateMarkdown');
const fs = require('fs');



// QUESTIONS

// Template
class Question{
    constructor(type, name, message, otherPropsObj){
        this.type = type;
        this.name = name;
        this.message = message;

        for (const property in otherPropsObj)
            this[property] = otherPropsObj[property];
    }

    static validator(input, errMsg){
        if (input)
            return true;
        
        console.log('  * ' + errMsg);
        return false;
    }
}

const TAB = '    '; //4 spaces


//1st batch of questions (up till installation instructions)
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
        'confTOC',
        'Do you want to include a table of contents?',
        {default: true}),
    new Question(
        'confirm',
        'confInstallInstructions',
        'Do you want to include install instructions?',
        {default: false}),
];


//Second batch of questions (up till add'l collaborators)
const questionsBatch2 = [
    new Question(
        'input',
        'usageInstructions',
        'Provide usage instructions / examples:',
        {validate: input => Question.validator(input, "Please enter usage instructions for your project!")}),
    new Question(
        'input',
        'name',
        "What's your name?",
        {validate: input => Question.validator(input, "Please enter your name!")}),
    new Question(
        'input',
        'github',
        "What's your GitHub username?",
        {validate: input => Question.validator(input, "Please enter your GitHub username!")}),
    new Question(
        'confirm',
        'confAddlCollabs',
        'Do you want to add additional collaborators?',
        {default: false}
    )
];


//Inquirer looper
    //unitName: unit being looped over, e.g. 'collaborator'    
    //outputPropName = name of the property in the final object that's returned, e.g. 'collaborators'
    //questions = one or more objects, each with two properties specified:
        //propName: name of the property corresponding to this question, e.g. 'name' or 'github'    
        //seed: basic question text, e.g. 'Enter name of'
const inquirerLoop = (outputPropName, unitName, ...questions) => new Promise((resolve) => {    
    unitName = wordToTitlecase(unitName);
    
    let counter = 1;
    let outputElems = [];
    const firstPropName = questions[0].propName;

    const promptNext = () => {
        let roundOfQuestions = [];

        //Build array of questions for this round
        questions.forEach((q, index) => 
            roundOfQuestions.push(new Question(
                'input',
                q.propName,
                `${TAB}- ${q.seed} ${unitName} #${counter}${index === 0 ? ' (or enter "done")' : ''}:`,
                {
                    validate: input => Question.validator(input, "Don't leave this blank!"),
                    when: (answersSoFar) => {
                        if (answersSoFar[firstPropName] === 'done'){ //if first question is answered 'done', skip the rest of the questions in this round, and (below) proceed to resolve()
                            return false;
                        }
                        
                        return true;
                    }
                }
            ))
        );
        
        //Prompt this round of questions
            //If 'done' is entered as first answer, resolve this Promise with the results of all previous rounds of questions; otherwise, ask another round
        inquirer.prompt(roundOfQuestions)
            .then((results) => {
                if (results[firstPropName] === 'done'){
                    let finalOutput = {};
                    finalOutput[outputPropName] = outputElems;
                    resolve(finalOutput)
                }
                else{
                    outputElems.push(results);
                    counter++;
                    promptNext();
                }
            })
        ;
    }

    promptNext(); //Prompts user w/ all questions related to 'unit' #1, then call recursively for further units (until user types 'done')
});


//set a single word to Titlecase
const wordToTitlecase = (word) => {
    let output = word.split('');
    
    output[0] = output[0].toUpperCase();
    
    return output.join('');
}







    
// TODO: Create a function to write README file
const writeToFile = (fileName, data) => {

};

// TODO: Create a function to initialize app
const init = () => {
    // inquirerLoop('collaborators', 'collaborator',
    //     {
    //         propName: 'name',
    //         seed: 'Enter name of'
    //     },
    //     {
    //         propName: 'github',
    //         seed: 'Enter GitHub account for'
    //     }
    // )
    //     .then(results => console.log(results));
};


// INITIALIZE
init();
