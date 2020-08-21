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

// define default theme
let theme = 'generic';
let backgroundColor = null;
let filePathInfix = '';

// a set of color themes
let radialColorsByTheme = {
    'generic': ['#051F20', '#235347', '#8EB69B'],
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

// read 'theme' cli argument
if(argv.theme) {
    theme = argv.theme;
    radialColors = radialColorsByTheme[theme];
}
// read 'colors'' cli argument
if(argv.colors) {
    radialColors = argv.colors.split(',');
}
// read 'background'' cli argument
if(argv.background) {
    backgroundColor = argv.background;
}
// read 'infix' cli argument
if(argv.infix) {
    filePathInfix = argv.infix;
}

// initialize the chart object
let radialIndicator = new chart('#radialContainer', {
    diameter: 130,
    min: 0,
    max: 10,
    stroke: {
        width: 30,
        gap: 10
    },
    shadow: {
        width: 5
    },
    round: false,
    series: [
        {value: 0, color: {solid: radialColors[0], background: '#777'}},
        {value: 0, color: {solid: radialColors[1], background: '#666'}},
        {value: 0, color: {solid: radialColors[2], background: '#555'}},
    ]
});

if(backgroundColor) {
    radialIndicator.svg.append("g").lower()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", (radialIndicator.width / 2) - 5)
        .style("fill", backgroundColor)
        .style("fill-opacity", 0.75)
        .style("stroke", radialColors[0])
        .style("stroke-width", "5");
}

// iterate through the radial bar values
for(let radialBarOneValue = 0; radialBarOneValue <= 10; ++radialBarOneValue) {
    for(let radialBarTwoValue = 0; radialBarTwoValue <= 10; ++radialBarTwoValue) {
        process.stdout.write(radialBarOneValue.toString() + "    " + radialBarTwoValue.toString() + "    ");
        for(let radialBarThreeValue = 0; radialBarThreeValue <= 10; ++radialBarThreeValue) {
            process.stdout.write(".");
            // create folder
            fs.mkdirSync('./radial/' + theme + '/' + filePathInfix + radialBarOneValue + '/' + radialBarTwoValue, { recursive: true });

            // update chart
            radialIndicator.update([radialBarOneValue, radialBarTwoValue, radialBarThreeValue]);

            let fileName = './radial/' + theme + '/' + filePathInfix + radialBarOneValue + '/' + radialBarTwoValue + '/' + radialBarThreeValue;

            // read SVG code from HTML div
            let svgBuffer = body.select('#radialContainer').html();

            // store SVG code to file system
            fs.writeFileSync(fileName + '.svg', svgBuffer);

            // convert SVG into PNG file and store into filesystem
            sharp(fileName + '.svg')
                .png()
                .resize(31, 31)
                .toFile(fileName + '.png')
                .catch(function(err) {
                    console.log(err)
                });
            sleep(50);
        }
        process.stdout.write("\r");
    }
}
console.log("\nDone");