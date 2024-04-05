const superagent = require('superagent');
const express = require('express');
const app = express();

app.use(
    express.urlencoded({
        extended: false,
        verify: (req, _, buffer) => {
            req.raw = buffer.toString();
        },
    })
);

app.post('/test', (req, res) => {
    const queryString = req.originalUrl.slice(req.originalUrl.indexOf('?') + 1);
    console.table({
        URL: req.originalUrl,
        rawBody: req.raw,
        parsedBodyStringified: JSON.stringify(req.body),
        rawQuery: queryString,
        parsedQueryStringified: JSON.stringify(req.query),
    });
    res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Test server listening on port ${PORT}.`));

/**
 * Why does superagent stringify the below object differently for the
 * request body and as a query string?
 * The documentation indicates the expected behaviour for both to be
 * as per the current query string behaviour.
 */
const obj = { foo: ['bar', 'baz'] };
superagent.post('http://localhost:3000/test').type('form').send(obj).query(obj).end();
