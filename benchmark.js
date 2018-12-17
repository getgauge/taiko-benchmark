const Benchmark = require('benchmark');
const fs = require('fs');
const path = require('path');
const os = require('os');
const speedTest = require('speedtest-net');
const test = speedTest({maxTime: 5000});
let speed;
test.on('data', data => {
  speed = data.speeds;
});
const {
  openBrowser,
  closeBrowser,
  comboBox,
  fileField,
  to,
  attach,
  checkBox,
  goto,
  radioButton,
  textField,
  write,
  into,
  scrollTo,
  scrollDown,
  scrollLeft,
  scrollRight,
  scrollUp,
  $,
  alert,
  click,
  button,
  dismiss,
  accept
} = require('taiko');
let suite = new Benchmark.Suite();
const benchmarkResults = [];

async function _openBrowser() {
  await openBrowser({
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote']
  })
}
// add tests
suite.add({
  'name': 'openBrowser goto and closeBrowser',
  'fn': async (deferred) => {
    await _openBrowser();
    await goto("https://getgauge-examples.github.io/js-taiko/");
    await closeBrowser();
    deferred.resolve();
  },
  'defer': true
})
.add({
    'name': 'combobox',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      const box = comboBox('Car');
      await box.exists();
      await box.select('Saab');
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'checkbox',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      const box = checkBox('Vehicle');
      await box.exists();
      await checkBox('Vehicle').check();
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'radiobotton',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      const button = radioButton('Female');
      await button.exists();
      await button.select();
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'attachFile',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      const field = fileField('File');
      await attach('file.txt', to(field));
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'textField and write',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      await write('Gopher', into('Username'));
      const field = textField('Username');
      await field.exists();
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'scroll(to,right,left,down,up) ',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      await scrollTo($('#myDIV'));

      // Scrolling the page
      await scrollRight(200);
      await scrollLeft();
      await scrollLeft(100);
      await scrollDown(200);
      await scrollUp(100);
      await scrollUp();

      // Scrolling a specific element
      await scrollRight($('#myDIV'), 200);
      await scrollLeft($('#myDIV'), 100);
      await scrollLeft($('#myDIV'));
      await scrollDown($('#myDIV'), 200);
      await scrollUp($('#myDIV'));
      await scrollUp($('#myDIV'), 100);
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'alert and click button',
    'fn': async (deferred) => {
      await _openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      alert('Message 1', async () => await dismiss());
      alert('Message 2', async () => await accept());
      await click(button("Alert"));
      await click(button("Alert1"));
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  // add listeners
  .on('cycle', function (event) {
    const targetResult = {}
    targetResult['result'] = String(event.target);
    targetResult['stats'] =  event.target.stats;
    benchmarkResults.push(targetResult);
  })
  .on('complete', function () {
    console.log(benchmarkResults);
    const dir = path.join(process.cwd());
    const osPlatform = os.platform();
    const result = {
      'taikoVersion' : require('taiko/package.json').version,
      'chromiumVersion': require('taiko/package.json').taiko.chromium_version,
      'machineDetails':{
      platform: osPlatform,
      release: os.release(),
      osType: os.type(),
      osArch: os.arch(),
      cpus: os.cpus(),
    },
    'networkSpeed' : {'upload': speed.upload + 'Mbps', 'download': speed.download + 'Mbps'},
    'benchmarks': benchmarkResults
    }
    if (!fs.existsSync(dir)){
      fs.mkdir(dir , { recursive: true },(err) => {
        if (err) throw err;
      });
    }
      fs.writeFile(path.join(dir,`${Date.now()}-${osPlatform}.json`), JSON.stringify(result),(err) => {
      if (err) throw err;
    }); 
  })
  // run async
  .run({
    async: true
  });