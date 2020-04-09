# pulseFG
## Electron / NodeJS Resources
- In this project, the electron.js file has to import files "old school" / non ES6:
    - [module.exports in NodeJS](https://stackabuse.com/how-to-use-module-exports-in-node-js/)
    - [vanilla vs. ES6 classes in NodeJS](https://m.dotdev.co/how-to-use-classes-in-node-js-with-no-pre-compilers-and-why-you-should-ad9ffd63817d)
    - [more import / export syntax](https://www.sitepoint.com/understanding-module-exports-exports-node-js/)
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
---
## React Resources
- Client-side, a lot of ES6 comes into play, so remember to use arrow syntax to keep references to 'this' in order:
    - [React this.setState binding error](https://stackoverflow.com/questions/31045716/react-this-setstate-is-not-a-function)
- ES6 Imports / Exports are useful here as well to keep API calls and files light-weight and organized:
    ```javascript
    // API File
    export const getComps = (callback) => {
        window.api.promise('/comp', {message: 'getting compendiums...'}, (res) => {
            callback(res);
        });
    }

    export const createComp = (form, callback) =>{
        window.api.promise('/comp/create', form, (res) => {
            callback(res);
        });
    }

    // Component(s):
    import * as API from '../../../containers/compendiums/compendiumsAPI';
    ```
    - [ES6 Import / Export syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- React Context and State Management:
    - [Context API](https://reactjs.org/docs/context.html)
    - [Class vs. Function Usage](https://www.taniarascia.com/using-context-api-in-react/)
    - [Wes Bos Video Demo](https://www.youtube.com/watch?v=XLJN4JfniH4)
    - [State in function components w/ Hooks](https://reactjs.org/docs/hooks-state.html)
- [React-Color](https://casesandberg.github.io/react-color/)
---
## React-Vis Resources
- When handling react-vis events, be mindful of how many times they call (ex: on every mouse move). With this in mind, I've kept a lot of data relevant to react-vis events as arrays in state. This allows me to have O(1) access to these fields via the x-axis value.
    ```javascript
    state={ dateCreatedSet: [] }
    //...
    this.props.matchData.forEach((match) => {
        dateCreatedSet.push(match.createdAt);
    });
    {this.state.dateCreatedSet[this.state.focusValue[0].x}
    ```