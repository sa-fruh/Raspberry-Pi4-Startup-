import Machine from "./Modules/Machine";
import Browser from "./Modules/Browser";
import Mail from "./Modules/Mail";
import Log from "./Modules/Log";

// Path is relative to the Log.ts file.
const log = new Log("../logs/log.log");

async function main() {
    // Define the machine object and network interface name
    const machine = new Machine(); // "eth0" or "wlan0"
    // Define the mailer object and set the "from" and "to" addresses.
    const mailer = new Mail(`${machine.hostname}@fruh.ch`, "prueede@fruh.ch");
    // Define the browser object and set the URL to open.
    const browser = new Browser("chromium");

    // Send a mail if it is allowed to do so.
    if (mailer.mailIsAllowed()) {
        const logFiles = await log.getLogFiles();
        if (logFiles.length > 0) {
            await mailer.sendMail(
                "Report",
                JSON.stringify(machine.interface, null, 4),
                logFiles.map(file => ({path: file}))
            );
        }
    }

    // Start the Browser
    const webAddress = `https://internaldigitalsignage.fruh.ch/news?id=${machine.interface.mac}`;
    await log.write(`Starting Chromium "(${webAddress})"`);
    await browser.launch();
    await browser.openWebPage(webAddress);

    // Restart the next day at 2:00 AM
    const restartTime = new Date();
    restartTime.setHours(2, 0, 0, 0);
    if (restartTime < new Date()) {
        restartTime.setDate(restartTime.getDate() + 1);
    }
    const timeToRestart = restartTime.getTime() - new Date().getTime();
    setTimeout(async () => {
        await machine.reboot();
    }, timeToRestart);
}

main().catch(async (err) => {
    await log.write(err.message, "ERROR");
});
