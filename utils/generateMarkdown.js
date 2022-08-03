
// Get link for license's SVG file
const renderLicenseBadge = (licenseName) => 
    `https://img.shields.io/badge/license-${licenseName}-informational`;


// Get link for a given license
const renderLicenseLink = (licenseName) => {
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


// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license){}


// TODO: Create a function to generate markdown for README
function generateMarkdown(data){
    return
    `# ${data.title}

`;
}

module.exports = generateMarkdown;
