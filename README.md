# myCarousel
Universal custom element for carousel images.

For users available functions play(), pause(), prev(), next() of element <my-carousel></my-carousel>.
You can use also events 'started', 'stopped', 'slidechange' which dispatch element.
There is a possibility set next attributes:
   'duration' - duration of animate,
   'timeout' - the interval between changing images during 'play()',
   'panel' - true/false, create or delete 'play' and 'pause' buttons,
   'crumbs' - true/false, create or delete points which correspond to the pictures.

result.js - crossbrowser file  is processing by Babel.js, using webpack.

Example of work this element - index.html.
