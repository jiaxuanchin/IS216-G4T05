var rangeText = function (start, end) {
        var str = '';
        str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
        str += end ? end.format('Do MMMM YYYY') : '...';

        return str;
    },
    css = function(url){
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        head.appendChild(link);
    },
    script = function (url) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = url;
        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
    callbackJson = function(json){
        var id = json.files[0].replace(/\D/g,'');
        document.getElementById('gist-' + id).innerHTML = json.div;

        if (!document.querySelector('link[href="' + json.stylesheet  + '"]')) {
            css(json.stylesheet);
        }
    };


window.onload = function () {
    var gists = [

        'https://gist.github.com/wakirin/d4f00465b259590233f0727f01eaba66.json?callback=callbackJson',

    ];
    
    if (!window.location.href.startsWith('file')) {
        gists.forEach(function(entry, key){
            script(entry);
        });
    }
};


// demo-2
new Lightpick({
    field: document.getElementById('demo-2'),
    singleDate: false,
    onSelect: function(start, end){
        document.getElementById('result-2').innerHTML = rangeText(start, end);
    }
});

