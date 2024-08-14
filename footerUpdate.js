const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { addFooterToImage } = require('./FooterUpdateHelper');

const directoryPath = './uploads';

// Function to delete files starting with "footer-"
async function deleteFooterFiles(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return reject(`Unable to scan directory: ${err}`);
            }

            files.forEach((file) => {
                if (file.startsWith('footer-')) {
                    const filePath = path.join(dirPath, file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file: ${filePath}`);
                        } else {
                            console.log(`Deleted: ${filePath}`);
                        }
                    });
                }
            });
            resolve();
        });
    });
}

// Function to create previews in the folder
async function createPreviewsInFolder(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Check if the file is an image and doesn't already have the footer prefix
            if (file.match(/\.(jpg|jpeg|png|gif)$/i) && !file.startsWith('footer-')) {

                // Read the image file
                const imageData = fs.readFileSync(filePath);
                const base64Image = "data:image/jpeg;base64," + imageData.toString('base64');

                // Create the preview image buffer
                const previewBuffer = await addFooterToImage(imageData, {
                    name: "Your Name",
                    email: "Your Email",
                    phone: "Your Phone",
                    isLogo: true
                }, '#60a5fa', base64Image);

                // Define the output file name and path
                const outputFilename = `footer-${file}`;
                const outputPath = path.join(folderPath, outputFilename);

                // Write the preview image to the file system
                fs.writeFileSync(outputPath, previewBuffer);
                console.log(`Preview created: ${outputPath}`);
            }
        }
    } catch (error) {
        console.error('Error creating previews:', error);
    }
}


// Function to prompt the user for options
async function promptUser() {

    const answers = inquirer.createPromptModule();
    const ans =  await answers([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'Delete all footer images',
                'Generate footer images',
                'Exit'
            ]
        }
    ])
    return ans.action

}

// Main function to run the script
async function main() {
    const action = await promptUser();

    if (action === 'Delete all footer images') {
        await deleteFooterFiles(directoryPath);
        console.log('All footer images have been deleted.');
    } else if (action === 'Generate footer images') {
        await createPreviewsInFolder(directoryPath);
        console.log('Footer images have been generated.');
    } else {
        console.log('Exiting...');
    }
}

main();
