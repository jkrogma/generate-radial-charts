# Generate Radial Bar Charts

Generates a set of radial bar charts as svg and png files with 3 radial bars.

## Install
1. Install Node.js
1. Clone this repository
1. run <pre><code>npm install</code></pre>

## Run
To let the script generate radial markers for you, run
<pre><code>node generate-markers.js --theme green</code></pre>
This will generate a set of radial svg and png images which will be stored in the folder <code>radial</code>.

Alternatively you may run this command: 
<pre><code>node generate-markers.js --colors "'#7C0A02','#B22222','#E25822'"</code></pre>
Where the list of colors can be replaced by any collection of three hex-coded colors. 
