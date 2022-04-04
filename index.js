const jsonServer = require('json-server');
const queryString = require('query-string')
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === 'PUT') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});


// In this example, returned resources will be wrapped in a body property
router.render = (req, res) => {

    const headers = res.getHeaders()
    const totalCountHeader = headers['x-total-count']
    const queryParam = queryString.parse(req._parsedUrl.query)
    if(req.method === 'GET' && totalCountHeader){
        const result = {
            data : res.locals.data,
            pagination :{
                _page:Number.parseInt(queryParam._page),
                _limit:Number.parseInt(queryParam._limit),
                _total:Number.parseInt(totalCountHeader)
            }
        }
        return res.jsonp(result)
    }
    res.jsonp(res.locals.data)
  }

// Use default router

const PORT = process.env.PORT  || 3000;  
server.use('/api', router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});


