
// UTILITY FUNCTIONS

// Get markdown for license badge image
const pullLicenseBadge = licenseName => {
    let licenseNameForLink = licenseName.split(' ').join('%20');
    return `[![License: ${licenseName}](https://img.shields.io/badge/License-${licenseNameForLink}-informational.svg)](${getLicenseLink(licenseName)})`;
}


// Get markdown for Contributor Covenant badge image
const pullContribCovenantBadge = () => 
    '[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)';


// Get link for a given license
const getLicenseLink = licenseName => {
    let linkPath;

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


// GENERATE SECTION FUNCTIONS

const generateTOCSection = (installInstructions, license, features, tests) => {
    const output = ['<i><b>', '## Table of contents'];

    if (installInstructions)
        output.push('- [Installation](#installation)');

    output.push('- [Usage](#usage)');

    if (features)
        output.push('- [Features](#features)');

    if (tests)
        output.push('- [Tests](#tests)');
    
    output.push('- [Credits](#credits)');
    
    if (license)
        output.push('- [License](#license)');

    output.push(
        '- [Contributing](#contributing)',
        '- [Questions](#questions)',
        '',
        '</i></b>'
    );

    return output.join('\n');
};


const generateInstallationSection = installInstructions => {
    let output = ['## Installation'];
    
    installInstructions.forEach((step, index) => 
        output.push(`${index + 1}. ${step}`)
    );
    
    return output.join('\n');
}


const generateFeaturesSection = features => {
    let output = ['## Features'];
    
    for (const feature of features)
        output.push(`- ${feature}`);
    
    return output.join('\n');
}


const generateTestsSection = tests => {
    let output = ['## Tests'];
    
    for (const test of tests)
        output.push(`- ${test}`);
    
    return output.join('\n');
}


const generateCollaboratorsList = collaborators => {
    let output = [];

    for (const collaborator of collaborators)
        output.push(`- ${collaborator.name} ([GitHub](https://github.com/${collaborator.github}))`);
    
    return output.join('\n');
}


const generateThirdPartyAssetsList = thirdPartyAssets => {
    let output = ['### Third-party assets'];
    
    for (const asset of thirdPartyAssets)
        output.push(`- [${asset.name}](${asset.link})`);
    
    return output.join('\n');
}


const generateTutorialsList = tutorials => {
    let output = ['### Tutorials'];
    
    for (const tutorial of tutorials)
        output.push(`- [${tutorial.name}](${tutorial.link})`);
    
    return output.join('\n');
}


const generateLicenseSection = license =>
    `## License

${pullLicenseBadge(license)}

Learn more about this license [here](${getLicenseLink(license)}).
`   ;



// GENERATE README MARKDOWN
const generateMarkdown = data => 
    `# ${data.title}
${data.license ? pullLicenseBadge(data.license) : ''}

${data.confContribCovenant ? pullContribCovenantBadge() : ''}
    

## Repo
[https://github.com/${data.githubUser}/${data.repoName}](https://github.com/${data.githubUser}/${data.repoName})


## Description
${data.description}


${data.confTOC ? generateTOCSection(data.installInstructions, data.license, data.features, data.tests) : ''}


${data.installInstructions ? generateInstallationSection(data.installInstructions): ''}


## Usage
${data.usageInstructions}


## Credits

### ${data.collaborators ? 'Collaborators' : 'Creator'}
- ${data.fullName} ([GitHub](https://github.com/${data.githubUser}))
${data.collaborators ? generateCollaboratorsList(data.collaborators) : ''}

${data.thirdPartyAssets ? generateThirdPartyAssetsList(data.thirdPartyAssets) : ''}

${data.tutorials ? generateTutorialsList(data.tutorials) : ''}

${data.license ? generateLicenseSection(data.license) : ''}

${data.features ? generateFeaturesSection(data.features) : ''}


## Contributing
${data.confContribStandardLang ?
    `Feel free to fork this project's [repo](https://github.com/${data.githubUser}/${data.repoName}), contribute code, and submit pull requests [here](https://github.com/${data.githubUser}/${data.repoName}/pulls)!`
    :
    data.contribLanguage
}

${data.confContribCovenant ?
    `${pullContribCovenantBadge()}

Contributors to this project must follow all guidelines set forth by the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
`   :
    ''
}

${data.tests ? generateTestsSection(data.tests) : ''}


## Questions
My GitHub username is [${data.githubUser}](https://github.com/${data.githubUser}).

If you have any questions, I'd be glad to hear from you—contact me at [${data.email}](mailto:${data.email}).
`   ;


// EXPORT generateMarkdown FUNCTION FOR EXTERNAL USE
module.exports = generateMarkdown;