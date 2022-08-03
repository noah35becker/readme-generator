
// PACKAGE REQUIREMENTS

const inquirer = require('inquirer');
const open = require('open');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown');



// QUESTIONS

// Templates
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


class LooperQuestion{
    constructor(seed, propName){
        this.seed = seed; // seed: basic question text, e.g. 'Enter name of'
        if (propName)
            this.propName = propName; // name of the property corresponding to this question, e.g. 'name' or 'github'    
    }
}


const TAB = '    '; //4 spaces


// 1st batch of questions (up till installation instructions)
const questionsBatch1 = [
    new Question(
        'input',
        'title',
        'What is the title of your project?',
        {validate: input => Question.validator(input, "Please enter your project's title!")}),
    new Question(
        'input',
        'desc',       
        'Provide a description of your project:',
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


// 2nd batch of questions (up till collaborators)
const questionsBatch2 = [
    new Question(
        'input',
        'usageInstructions',
        'Provide instructions / examples for your project:',
        {validate: input => Question.validator(input, "Please enter instructions / examples for your project!")}),
];


// 3rd batch of questions (ask about third-party assets)
const questionsBatch3 = [
    new Question(
        'confirm',
        'confThirdParty',
        'Do you want to add any credits for third-party assets?',
        {default: false}
    )
];


// 4th batch of questions (ask about crediting tutorials)
const questionsBatch4 = [
    new Question(
        'confirm',
        'confTutorials',
        'Do you want to add any credits for tutorials that helped you along the way?',
        {default: false}
    )
];


// 5th batch of questions
const questionsBatch5 = [
    new Question(
        'confirm',
        'confSeeLicenseDetails',
        `You will now be asked which type of license you'd like to use for your project.
${TAB}To help you choose, would you like to read more info online about these licenses?
${TAB}(If you don't know what this means, it's recommended that you select "Yes"!)`
        ,
        {default: false}
    ),
    new Question(
        'rawlist',
        'license',
        'Which type of license would you like for your project?',
        {
            choices: [
                'Apache License 2.0',
                'Boost Software License 1.0',
                'GNU AGPLv3',
                'GNU GPLv3',
                'GNU LGPLv3',
                'MIT License',
                'Mozilla Public License 2.0',
                'The Unlicense'
            ],
            when: ({confSeeLicenseDetails}) => {
                if (confSeeLicenseDetails)
                    open('https://choosealicense.com/licenses/');
                return true;
            }
        }
    )
]



//FUNCTIONS

// Inquirer prompt, prepending results so far
const inquirerPrompt = (resultsSoFar, questions) => new Promise((resolve) => {
    inquirer.prompt(questions)
    .then(theseResults => resolve({...resultsSoFar, ...theseResults}));
});


// Inquirer looper
    // atLeastOneRequired = whether or not user is required to answer at least one round of questions
    // title = title of the property in the final object that's returned, e.g. 'install instructions' 'collaborators'
    // unitName: unit being looped over, e.g. 'step' or 'collaborator' 
    // questions = one or more LooperQuestions
const inquirerLoop = (resultsSoFar, atLeastOneRequired, tab, title, unitName, ...questions) => new Promise((resolve) => {    
    unitName = wordToTitlecase(unitName);

    let outputPropName = '';
    
    title = title.split(' ');
    title.forEach((word, index) => 
        index === 0 ? outputPropName += word : outputPropName += wordToTitlecase(word)
    );
    title[0] = wordToTitlecase(title[0]);
    title = title.join(' ');

    
    let counter = 1;
    let outputElems = [];

    const DEFAULT_PROP_NAME = 'property';
    const moreThanOneQuestion = questions.length > 1;
    if (moreThanOneQuestion)
        var firstPropName = questions[0].propName;

    // Prompt user w/ all questions related to the current 'unit', then call recursively for further units as needed
    const promptNext = () => {
        let roundOfQuestions = [];

        // Build array of questions for this round
        questions.forEach((q, index) => 
            roundOfQuestions.push(new Question(
                'input',
                q.propName || DEFAULT_PROP_NAME,
                `${tab ? TAB : ''}- ${title} | ${q.seed} ${unitName} #${counter}${!(atLeastOneRequired && counter === 1) && index === 0 ? ' (or enter "done")' : ''}:`,
                {
                    validate: input => Question.validator(input, "Don't leave this blank!"),
                    when: (answersSoFar) => {
                        if (!(atLeastOneRequired && counter === 1) && moreThanOneQuestion && answersSoFar[firstPropName] === 'done'){ // if first question is answered 'done', skip the rest of the questions in this round, and (below) proceed to resolve()
                            return false;
                        }
                        
                        return true;
                    }
                }
            ))
        );
        
        // Prompt this round of questions
            // If 'done' is entered as first answer, resolve this Promise with the results of all previous rounds of questions; otherwise, ask another round
        inquirer.prompt(roundOfQuestions)
            .then((results) => {
                if (!(atLeastOneRequired && counter === 1) && (moreThanOneQuestion ? results[firstPropName] : results[DEFAULT_PROP_NAME]) === 'done'){
                    let finalOutput = {};
                    finalOutput[outputPropName] = outputElems;
                    resolve({...resultsSoFar, ...finalOutput}); //prepend results so far
                }
                else{
                    outputElems.push(
                        moreThanOneQuestion ? results : results[DEFAULT_PROP_NAME]
                    );
                    counter++;
                    promptNext();
                }
            })
        ;
    }

    promptNext();
});


// Set a single word to Titlecase
const wordToTitlecase = (word) => {
    let output = word.split('');
    
    output[0] = output[0].toUpperCase();
    
    return output.join('');
}







    
// TODO: Create a function to write README file
const writeToFile = (fileName, data) => {

};

// Initialize app
const init = () => {
    inquirerPrompt({}, questionsBatch1)
    .then(results => {
        if (results.confInstallInstructions)
            return inquirerLoop(
                results,
                false,
                true,
                'install instructions',
                'step',
                new LooperQuestion('Enter')
            );
        else
            return results;
    }).then(results => inquirerPrompt(results, questionsBatch2))
    .then(results => { 
        return inquirerLoop(
            results,
            true,
            false,
            'collaborators',
            'collaborator',
            new LooperQuestion('Enter name of', 'name'),
            new LooperQuestion('Enter GitHub username of', 'github')
        )
    }).then(results => inquirerPrompt(results, questionsBatch3))
    .then(results => {
        if (results.confThirdParty)
            return inquirerLoop(
                results,
                false,
                true,
                'third party assets',
                'asset',
                new LooperQuestion('Enter name of', 'name'),
                new LooperQuestion('Enter link for', 'link')
            );
        else
            return results;
    }).then (results => inquirerPrompt(results, questionsBatch4))
    .then(results => {
        if (results.confTutorials)
            return inquirerLoop(
                results,
                false,
                true,
                'tutorials',
                'tutorial',
                new LooperQuestion('Enter name of', 'name'),
                new LooperQuestion('Enter link for', 'link')
            );
        else
            return results;
        
    }).then(results => inquirerPrompt(results, questionsBatch5)
    )
    
    
    .then(results =>
        console.log(results)
    );
};


// INITIALIZE
init();
