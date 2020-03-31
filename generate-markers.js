const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const sharp = require('sharp');
const chart = require('./js/radial-progress-chart');

const argv = require('yargs').argv

const { JSDOM } = jsdom;

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// make document object directly accessible
document = window.document;

// Append our SVG Container
let body = d3.select(window.document).select('body');
body.append('div').attr('id', 'radialContainer');

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(ms) {
    msleep(ms);
}

let theme = 'green';
let radialColorsByTheme = {
    'green': ['#051F20', '#235347', '#8EB69B'],
    'red': ['#7C0A02', '#B22222', '#E25822'],
    'pink': ['#721b65', '#b80d57', '#f8615a'],
    'lilac': ['#363062', '#4d4c7d', '#827397'],
    'brown': ['#aa530e', '#df8931', '#f5c16c'],
    'nature': ['#5a3921', '#6b8c42', '#7bc67b'],
    'marine': ['#000839', '#005082', '#00a8cc'],
    'blue': ['#142850', '#27496d', '#0c7b93'],
    'bonbon': ['#111d5e', '#b21f66', '#fe346e'],
};

if(argv.theme) {
    theme = argv.theme;
    radialColors = radialColorsByTheme[theme];
}
if(argv.colors) {
    radialColors = argv.colors.split(',');
}

let radialIndicator = new chart('#radialContainer', {
    diameter: 130,
    min: 0,
    max: 10,
    stroke: {
        gap: 2
    },
    series: [
        {value: 0, color: {solid: radialColors[0], background: 'white'}},
        {value: 0, color: {solid: radialColors[1], background: 'white'}},
        {value: 0, color: {solid: radialColors[2], background: 'white'}},
    ]
});


let svgBuffer = '';
for(let firstRing = 0; firstRing <= 10; ++firstRing) {
    for(let secondRing = 0; secondRing <= 10; ++secondRing) {
        for(let thirdRing = 0; thirdRing <= 10; ++thirdRing) {
            fs.mkdirSync('./radial/' + theme + '/' + firstRing + '/' + secondRing, { recursive: true });
            console.log('generating radial/' + theme + '/' + firstRing + '/' + secondRing + '/' + thirdRing + '.svg');
            radialIndicator.update([firstRing, secondRing, thirdRing]);
            svgBuffer = body.select('#radialContainer').html();
            fs.writeFileSync('./radial/' + theme + '/' + firstRing + '/' + secondRing + '/' + thirdRing + '.svg', svgBuffer);
            console.log('converting into radial/' + theme + '/' + firstRing + '/' + secondRing + '/' + thirdRing + '.png');
            sharp('./radial/' + theme + '/' + firstRing + '/' + secondRing + '/' + thirdRing + '.svg')
                .png()
                .resize(35, 35)
                .toFile('./radial/' + theme + '/' + firstRing + '/' + secondRing + '/' + thirdRing + '.png')
                .catch(function(err) {
                    console.log(err)
                });
            sleep(50);
        }
    }
}
