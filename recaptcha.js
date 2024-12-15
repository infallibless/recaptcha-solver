const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const axios = require('axios');
const fs = require('fs');

async function transcribe(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const audioFile = './temp_audio.mp3';
    fs.writeFileSync(audioFile, response.data);
    return 'dummy transcription text';
}

async function raynex(driver) {
    await driver.switchTo().defaultContent();
    const iframe = await driver.findElement(By.xpath(".//iframe[@title='reCAPTCHA']"));
    await driver.switchTo().frame(iframe);
    const checkbox = await driver.findElement(By.id('recaptcha-anchor-label'));
    await checkbox.click();
    await driver.switchTo().defaultContent();
}

async function hasan(driver) {
    await driver.switchTo().defaultContent();
    const iframe = await driver.findElement(By.xpath(".//iframe[@title='recaptcha challenge expires in two minutes']"));
    await driver.switchTo().frame(iframe);
    const audiobutton = await driver.findElement(By.id('recaptcha-audio-button'));
    await audiobutton.click();
}

async function rau(driver) {
    const audisrc = await driver.findElement(By.id('audio-source'));
    const audiourl = await audisrc.getAttribute('src');
    const transcription = await transcribe(audiourl);
    const responseinput = await driver.findElement(By.id('audio-response'));
    await responseinput.sendKeys(transcription);
    const verifybutton = await driver.findElement(By.id('recaptcha-verify-button'));
    await verifybutton.click();
}

(async function main() {
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    try {
        await driver.get('https://www.google.com/recaptcha/api2/demo');
        await raynex(driver);
        await driver.sleep(1000);
        await hasan(driver);
        await driver.sleep(1000);
        await rau(driver);
        await driver.sleep(10000);

    } finally {
        await driver.quit();
    }
})();
