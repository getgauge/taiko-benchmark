var Benchmark = require('benchmark');
var {
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
var suite = new Benchmark.Suite();

// add tests
suite.add({
    'name': 'combobox',
    'fn': async (deferred) => {
      await openBrowser();
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
      await openBrowser();
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
      await openBrowser();
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
      await openBrowser();
      await goto("https://getgauge-examples.github.io/js-taiko/");
      const field = fileField('File');
      await attach('file.txt', to(field));
      await closeBrowser();
      deferred.resolve();
    },
    'defer': true
  })
  .add({
    'name': 'textField',
    'fn': async (deferred) => {
      await openBrowser();
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
    'name': 'scroll',
    'fn': async (deferred) => {
      await openBrowser();
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
    'name': 'alert',
    'fn': async (deferred) => {
      await openBrowser();
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
    console.log(String(event.target));
    console.log(event.target.stats);
  })
  .on('complete', async function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({
    async: true
  });