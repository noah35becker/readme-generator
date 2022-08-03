
// Get markdown for license badge image
const pullLicenseBadge = (licenseName) => 
    `[![License: ${licenseName}](https://img.shields.io/badge/license-${licenseName}-informational.svg)](${getLicenseLink(licenseName)}`;


// Get markdown for Contributor Covenant badge image
const pullContribCovenantBadge = () => 
    '[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/}';


// Get link for a given license
const getLicenseLink = (licenseName) => {
    var linkPath;

    switch (licenseName){
        case 'Apache License 2.0':
            linkPath = 'apache-2.0';
            break;
        case 'Boost Software License 1.0':
            linkPath = 'bsl-1.0';
            break;
        case 'GNU AGPLv3':
            linkPath = 'agpl-3.0';
            break;
        case 'GNU GPLv3':
            linkPath = 'gpl-3.0';
            break;
        case 'GNU LGPLv3':
            linkPath = 'lgpl-3.0';
            break;
        case 'MIT License':
            linkPath = 'mit';
            break;
        case 'Mozilla Public License 2.0':
            linkPath = 'mpl-2.0';
            break;
        case 'The Unlicense':
            linkPath = 'unlicense';
            break;
    }

    return `https://choosealicense.com/licenses/${linkPath}`;
}


const generateTOCSection = (installInstructions) =>
    `## Table of contents
${installInstructions.length > 0 ? '- [Installation](#installation)' : ''}
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)`
    ;


const generateCollaboratorsList = (collaborators) => {
    let output = [];

    for (const collaborator of collaborators)
        output.push(`- ${collaborator.name} ([GitHub](https://github.com/${collaborator.github}))`);
    
    return output.join('\n');
}


const generateThirdPartyAssetsList = (thirdPartyAssets) => {
    let output = ['### Third-party assets'];
    
    for (const asset of thirdPartyAssets)
        output.push(`- [${asset.name}](${asset.link})`);
    
    return output.join('\n');
}


const generateTutorialsList = (tutorials) => {
    let output = ['### Tutorials'];
    
    for (const tutorial of tutorials)
        output.push(`- [${tutorial.name}](${tutorial.link})`);
    
    return output.join('\n');
}


const generateLicenseSection = (license) =>
    `## License

${pullLicenseBadge(license)}
Learn more about this license at ${getLicenseLink(license)}
`   ;


const generateFeaturesSection = (features) => 
    ['## Features', '', ...features].join('\n');

    
const generateTestsSection = (tests) => 
    ['## Tests', '', ...tests].join('\n');



// Generate README.md markdown
const generateMarkdown = (...data) => 
    `# ${title}
${license ? pullLicenseBadge(license) : ''}

${confContribCovenant ? pullContribCovenantBadge() : ''}
    

## Description
${description}


${confTOC ? generateTOCSection(installInstructions) : ''}


## Usage
${usageInstructions}


## Credits

### Collaborators
- ${fullName} ([GitHub](https://github.com/${githubUser}))
${collaborators.length > 0 ? generateCollaboratorsList(collaborators) : ''}

${thirdPartyAssets.length > 0 ? generateThirdPartyAssetsList(thirdPartyAssets) : ''}

${tutorials.length > 0 ? generateTutorialsList(tutorials) : ''}


${license ? generateLicenseSection(license) : ''}

${features ? generateFeaturesSection(features) : ''}


## How to contribute
${confContribStandardLang ?
    `Feel free to fork this project's [repo](https://github.com/${githubUser}/${repoName}), contribute code, and submit pull requests [here](https://github.com/${githubUser}/${repoName}/pulls)!`
    :
    contribLanguage
}
${confContribCovenant ?
    `${pullContribCovenantBadge()}
Contributors to this project must follow all guidelines set forth by the [Contributor Covenant](https://www.contributor-covenant.org/).
`   :
    ''
}

${tests.length > 0 ? generateTestsSection(tests) : ''}

`   ;



module.exports = generateMarkdown;
