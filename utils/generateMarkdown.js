
// Get markdown for license badge image
const pullLicenseBadge = (licenseName) => {
    let licenseNameForLink = licenseName.split(' ').join('%20');
    return `[![License: ${licenseName}](https://img.shields.io/badge/License-${licenseNameForLink}-informational.svg)](${getLicenseLink(licenseName)})`;
}


// Get markdown for Contributor Covenant badge image
const pullContribCovenantBadge = () => 
    '[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/)';


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
${installInstructions ? '- [Installation](#installation)' : ''}
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)`
    ;


const generateInstallationSection = (installInstructions) => {
    let output = ['## Installation'];
    
    for (const step of installInstructions)
        output.push(`- ${step}`);
    
    return output.join('\n');
}


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

Learn more about this license [here](${getLicenseLink(license)}).
`   ;


const generateFeaturesSection = (features) => {
    let output = ['## Features'];
    
    for (const feature of features)
        output.push(`- ${feature}`);
    
    return output.join('\n');
}

    
const generateTestsSection = (tests) => {
    let output = ['## Tests'];
    
    for (const test of tests)
        output.push(`- ${test}`);
    
    return output.join('\n');
}



// Generate README.md markdown
const generateMarkdown = (data) => 
    `# ${data.title}
${data.license ? pullLicenseBadge(data.license) : ''}

${data.confContribCovenant ? pullContribCovenantBadge() : ''}
    

## Repo
[https://github.com/${data.githubUser}/${data.repoName}](https://github.com/${data.githubUser}/${data.repoName})


## Description
${data.description}


${data.confTOC ? generateTOCSection(data.installInstructions) : ''}


${data.installInstructions ? generateInstallationSection(data.installInstructions): ''}


## Usage
${data.usageInstructions}


## Credits

### Collaborators
- ${data.fullName} ([GitHub](https://github.com/${data.githubUser}))
${data.collaborators ? generateCollaboratorsList(data.collaborators) : ''}

${data.thirdPartyAssets ? generateThirdPartyAssetsList(data.thirdPartyAssets) : ''}

${data.tutorials ? generateTutorialsList(data.tutorials) : ''}


${data.license ? generateLicenseSection(data.license) : ''}

${data.features ? generateFeaturesSection(data.features) : ''}


## How to contribute
${data.confContribStandardLang ?
    `Feel free to fork this project's [repo](https://github.com/${data.githubUser}/${data.repoName}), contribute code, and submit pull requests [here](https://github.com/${data.githubUser}/${data.repoName}/pulls)!`
    :
    data.contribLanguage
}

${data.confContribCovenant ?
    `${pullContribCovenantBadge()}

Contributors to this project must follow all guidelines set forth by the [Contributor Covenant](https://www.contributor-covenant.org/).
`   :
    ''
}


## Questions
See me on GitHub [here](https://github.com/${data.githubUser}). 

Feel free to contact me with any questions at [${data.email}](mailto:${data.email}).


${data.tests ? generateTestsSection(data.tests) : ''}

`   ;



module.exports = generateMarkdown;
