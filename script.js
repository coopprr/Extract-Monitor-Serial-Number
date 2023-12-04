// Import the execSync function from the child_process module for running shell commands
const { execSync } = require('child_process');

// Import the axios library for making HTTP requests
const axios = require('axios');

// Function to get the monitor serial number
function getMonitorSerial() {
    try {
        // Get the current operating system platform
        const platform = process.platform.toLowerCase();

        // Check if the platform is macOS
        if (platform === 'darwin') {
            // For Mac OS, run the 'ioreg' command to get the monitor serial number
            const serial = execSync('ioreg -l | grep "IODisplayEDID" | awk \'/[^\"]/{print $\"NF\"}\'', { encoding: 'utf-8' }).trim();
            return serial;
        } else {
            // If the platform is not macOS, throw an error for an unsupported operating system
            throw new Error("Unsupported operating system");
        }
    } catch (error) {
        // Handle errors and log the message
        console.error(`Error: ${error.message}`);
        return null;
    }
}

// Function to send the serial number to Slack
async function sendToSlack(serial, sender) {
    // Define the Slack endpoint for the HTTP POST request
    const slackEndpoint = "https://hooks.slack.com/workflows/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";

    // Create a payload with the serial number and sender name
    const payload = {
        serial: serial,
        sender: sender
    };

    try {
        // Make an HTTP POST request to the Slack endpoint with the payload
        const response = await axios.post(slackEndpoint, payload);

        // Return true if the response status is 200 (OK)
        return response.status === 200;
    } catch (error) {
        // Handle errors and log the message
        console.error(`Error sending to Slack: ${error.message}`);
        return false;
    }
}

// Main function
async function main() {
    // Replace "Your Name" with your actual name
    const senderName = "Giorgi Kuprashvili";

    // Get the monitor serial number
    const monitorSerial = getMonitorSerial();

    // Check if the monitor serial number is successfully obtained
    if (monitorSerial) {
        // Send the monitor serial number to Slack and check if it was successful
        const success = await sendToSlack(monitorSerial, senderName);

        // Output success or failure message based on the result
        if (success) {
            console.log("Serial sent to Slack successfully!");
        } else {
            console.error("Failed to send serial to Slack.");
        }
    } else {
        console.error("Unable to retrieve monitor serial number.");
    }
}

main();
