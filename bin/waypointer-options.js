const Fs = require('fs');
const Path = require('path');

module.exports ={
    'themes': [{
        theme: require('waypointer-plain'),
        options: {'path': '/plain'}
    },{
        theme: require('waypointer-hub'),
        options: {'path': '/hub'}
    },{
        theme: require('waypointer-form'),
        options: {'path': '/form'}
    }],
    'text': [{
        group: 'Sum',
        place: 'before',
        text: [{
            name: 'Introduction',
            markdown: 'Introduction',
            class: 'group-section'
        }]
    },{
        group: 'Sum',
        place: 'after',
        text: [{
            name: 'Maths',
            markdown: ' __Text to explain maths__',
            class: 'group-footer'
        }]
    },{
        path: '/sum/add/{a}/{b}',
        method: 'put',
        place: 'after',
        text: [{
            markdown: '__Notes:__ Some notes about this endpoint',
            class: 'alert tip'
        }]
    },{
        place: 'before',
        text: [{
            name: 'Introduction',
            markdown: Fs.readFileSync(Path.join(__dirname, '../markdown/intro.md'), 'utf8'),
            class: 'introduction'
        },{
            name: 'API key',
            markdown: Fs.readFileSync(Path.join(__dirname, '../markdown/keys.md'), 'utf8'),
            class: 'api-key'
        }]
    },{
        place: 'after',
        text: [{
            name: 'Usage policy',
            markdown: 'Usage policy defines the uses you can put the data to.',
            class: 'data-usage'
        }]
    }],
    'snippets': {
        lanugages: [{
            'lanugage': 'javascript',
        },{
            'lanugage': 'node',
        }, {
            'lanugage': 'shell',
            'methodology': 'curl'
        }]
    }
};