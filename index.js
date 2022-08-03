
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

    static validator(input){
        if (input)
            return true;
        
        console.log("  * Don't leave this blank!");
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

const TELL_ME_MORE_MSG = '*** Tell me more ***';


// 1st batch of questions (up till installation instructions)
const questionsBatch1 = [
    new Question(
        'input',
        'fullName',
        "What's your full name?",
        {validate: input => Question.validator(input)}),
    new Question(
        'input',
        'emailAddress',
        "What's your email address?",
        {validate: input => Question.validator(input)}),
    new Question(
        'input',
        'githubUser',
        "What's your GitHub username?",
        {validate: input => Question.validator(input)}),
    new Question(
        'input',
        'title',
        "What's the title of your project?",
        {validate: input => Question.validator(input)}),
    new Question(
        'input',
        'repoName',
        "What's the name of the project's repo on GitHub?",
        {validate: input => Question.validator(input)}),
    new Question(
        'input',
        'description',       
        'Provide a description of your project:',
        {validate: input => Question.validator(input)}),
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


// 2nd batch of questions (up till add'l collaborators)
const questionsBatch2 = [
    new Question(
        'input',
        'usageInstructions',
        'Provide instructions / examples that demonstrate how to use your project:',
        {validate: input => Question.validator(input)}),
    new Question(
        'confirm',
        'confAddlCollaborators',
        'Do you want to include additional collaborators?',
        {default: false}),
];


// 3rd batch of questions (ask about crediting third-party assets)
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


// 5th batch of questions (up till features)
const licenseChoices = [
    'Apache License 2.0',
    'Boost Software License 1.0',
    'GNU AGPLv3',
    'GNU GPLv3',
    'GNU LGPLv3',
    'MIT License',
    'Mozilla Public License 2.0',
    'The Unlicense',
    "** I don't want to include a license in my README **",
    TELL_ME_MORE_MSG
];

const questionsBatch5 = [
    new Question(
        'rawlist',
        'license1',
        'Which type of license would you like for your project?',
        {choices: licenseChoices}
    ),
    new Question(
        'rawlist',
        'license2',
        "Now that you've read up on licenses a bit, which type of license would you like for your project?"
        ,
        {
            choices: licenseChoices.slice(0, -1),
            when: ({license1}) => {
                if (license1 === TELL_ME_MORE_MSG){
                    open('https://choosealicense.com/licenses/');
                    return true;
                }

                return false;
            }
        }),
    new Question(
        'confirm',
        'confFeatures',
        "Do you want to include a list of your project's features?",
        {default: false}
    )
]


// 6th batch of questions (the last batch)
const questionsBatch6 = [
    new Question(
        'confirm',
        'confContribStandardLang',
        `For the section about how the public can make contributions to your project,
  do you want to use standard language? (Select "No" to write your own)`
        ,
        {default: true}),
    new Question(
        'input',
        'contribLanguage',
        `${TAB}Provide language about how the public can make contributions:`,
        {
            validate: input => Question.validator(input),
            when: ({confContribStandardLang}) => !confContribStandardLang
        }),
    new Question(
        'rawlist',
        'confContribCovenant1',
        'Do you want to include the Contributor Covenant in your README?',
        {choices: ['Yes', 'No', TELL_ME_MORE_MSG]}),
    new Question(
        'confirm',
        'confContribCovenant2',
        "Now that you've read up on the Contributor Covenant a bit, would you like to include it in your README?",
        {
            when: ({confContribCovenant1}) => {
                if (confContribCovenant1 === TELL_ME_MORE_MSG){
                    open('https://www.contributor-covenant.org/');
                    return true;
                }

                return false;
            }
        }),
    new Question(
        'confirm',
        'confTesting',
        'Do you want to include info about testing your application?',
        {default: false})
];



// FUNCTIONS

// Inquirer prompt, prepending results so far
const inquirerPrompt = (resultsSoFar, questions) => new Promise((resolve) => {
    inquirer.prompt(questions)
    .then(theseResults => resolve({...resultsSoFar, ...theseResults}));
});


// Inquirer looper
    // title = title of the property in the final object that's returned, e.g. 'install instructions' 'collaborators'
    // unitName: unit being looped over, e.g. 'step' or 'collaborator' 
    // questions = one or more LooperQuestions
const inquirerLoop = (resultsSoFar, title, unitName, ...questions) => new Promise((resolve) => {    
    // Capitailze unit name
    unitName = wordToTitlecase(unitName);

    // Set name of overarching output property, and capitalize first letter of title
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
                `${TAB}- ${title} | ${q.seed} ${unitName} #${counter}${index === 0 ? ' (or enter "done")' : ''}:`,
                {
                    validate: input => Question.validator(input),
                    when: (answersSoFar) => {
                        if (moreThanOneQuestion && answersSoFar[firstPropName] === 'done'){ // if first question is answered 'done', skip the rest of the questions in this round, and (below) proceed to resolve()
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
                if ((moreThanOneQuestion ? results[firstPropName] : results[DEFAULT_PROP_NAME]) === 'done'){
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

    // Initialize round #1 of questions
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


// Initializer
const init = () => {
    inquirerPrompt({}, questionsBatch1)
    .then(results => {
        if (results.confInstallInstructions)
            return inquirerLoop(
                results,
                'install instructions',
                'step',
                new LooperQuestion('Enter')
            );
        else
            return results;
    }).then(results => inquirerPrompt(results, questionsBatch2))
    .then(results => { 
        if (results.confAddlCollaborators)
            return inquirerLoop(
                results,
                'collaborators',
                'collaborator',
                new LooperQuestion('Enter name of', 'name'),
                new LooperQuestion('Enter GitHub username of', 'github')
            )
        else
            return results;
    }).then(results => inquirerPrompt(results, questionsBatch3))
    .then(results => {
        if (results.confThirdParty)
            return inquirerLoop(
                results,
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
                'tutorials',
                'tutorial',
                new LooperQuestion('Enter name of', 'name'),
                new LooperQuestion('Enter link for', 'link')
            );
        else
            return results;
    }).then(results => inquirerPrompt(results, questionsBatch5))
    .then(results => {
        if (results.confFeatures)
            return inquirerLoop(
                results,
                'features',
                'feature',
                new LooperQuestion('Enter')
            );
        else
            return results;
    }).then(results => inquirerPrompt(results, questionsBatch6))
    .then(results =>{
        if (results.confTesting)
            return inquirerLoop(
                results,
                'tests',
                'test',
                new LooperQuestion('Describe')
            );
        else
            return results;
    }).then(results =>
        console.log(results)
    );
};



// INITIALIZE
init();
