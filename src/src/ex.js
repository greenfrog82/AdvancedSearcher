let str = `
<!DOCTYPE html>
<html>
    <head>
        <title>index</title>
        <link src='stylesheet' type='text/css' href='/static/prism_fe/shared/common/css/common.css' />
        <link src='stylesheet' type='text/css' href='/op_media/shared/common/app.css' />
        <script type='text/javascript' src='/op_media/shared/en-us/js/common.js'></script>
        <script type='text/javascript' src='/op_media/shared/en-us/js/common.js'></script>
        <script type='text/javascript' src='/static/spectrum_fe/shared/common/js/app.js'></script>
        <script type='text/javascript' src='/static/spectrum_fe/shared/common/js/another-path.js'></script>
        <script type='text/javascript' src='/op_media/media/js/test.js'></script>
    </head>
    <body>
        <img src='/static/prism_fe/cdnetworks/common/img/logo.jpg' />
    </body>
</html>
`

// str = str.replace(/op_media\/shared\/common\/core\/js\/test.js/g, 'static/prism_fe/shared/common/core/js/test.js');
const target = '/op_media/shared/en-us/js/common.js'
str = str.replace(new RegExp(target, 'g'), 'static/prism_fe/shared/common/core/js/test.js');
console.log(str);