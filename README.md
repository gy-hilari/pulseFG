# pulseFG
## Electron / NodeJS Resources
- In this project, the electron.js file has to import files "old school" / non ES6:
    - [module.exports in NodeJS](https://stackabuse.com/how-to-use-module-exports-in-node-js/)
    - [vanilla vs. ES6 classes in NodeJS](https://m.dotdev.co/how-to-use-classes-in-node-js-with-no-pre-compilers-and-why-you-should-ad9ffd63817d)
- Routes are written with [electron-promise-ipc](https://www.npmjs.com/package/electron-promise-ipc); The API routes are not exported as functions, they are written as properties of the promiseIpc object and stored in a class:
    ```javascript
    function Router(db) {
        this.routes = promiseIpc;

        this.routes.on('test', () => {
            return new Promise((resolve, reject) => {
                console.log('IPC Reached main!');
                resolve('IPC Returned from main!');
            });
        });
    }

    module.exports = {
        Router: Router
    }
    ```
- This may appear strange as a new Router class will be declared with no function calls, but by its declaration alone, the routes will then be accessible and work in the file the Router was imported:
    ```javascript
    const Router = router.Router;
    const routes = new Router(db);
    ```
