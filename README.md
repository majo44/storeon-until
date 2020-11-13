# storeon-until

[![npm version](https://badge.fury.io/js/storeon-until.svg)](https://badge.fury.io/js/storeon-substore)
[![Build Status](https://travis-ci.org/majo44/storeon-until.svg?branch=master)](https://travis-ci.org/majo44/storeon-substore)
[![Coverage Status](https://coveralls.io/repos/github/majo44/storeon-until/badge.svg?branch=master)](https://coveralls.io/github/majo44/storeon-substore?branch=master)

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">
     
Utility for awaiting [Storeon](https://github.com/storeon/storeon) events.    

It size is 67 B (minified and gzipped) and uses [Size Limit](https://github.com/ai/size-limit) to control size.

### Overview
The goal of this tiny library is provide the easy way to awaiting occurrence of the particular
storeon event. 

### Install
> npm i storeon-until --save

### Usage
 
```javascript

import { createStoreon } from "storeon";
import { until } from "storeon-until";

// create store 
const store = createStoreon([]);

// some async event handler
store.on('loadDocument', async (state, id) => {
    const document = await fetch(`http://some.document.com/${id}`);
    store.dispatch('documentLoaded', {id, document});
});
// reducer for ending event
store.on('documentLoaded', (_, {id, document}) => ({
    id,
    document
}));

// awaiting for the ending event
const documentLoadedPromise = await until(store, 'documentLoaded', (_, {id}) => id === 'id1');
// dispatch event
store.dispatch('loadDocument', 'id1');
// waits until async flow will finish
const {id, document} = await documentLoadedPromise;

console.log(document);

// we can also await for the state
const statePromise = until(store, '@changed', ({id}) => id === 'id2');
// dispatch event
store.dispatch('loadDocument', 'id2');
// waits until data in state will pass condition
const {id, document} = await statePromise;
console.log(document);

```

**Caution**

Please notice, that we should always use `until` utility to create promise before the event dispatch 
as dispatched event can run synchronously.   

### Api
- `until` - is function which returns promise of requested event data. Params:
  - `store` the store
  - `event` the event which we are waiting for
  - `condition` - (optional) - the function which gets state, and event data and have to return true 
  if promise has to be resolved for that state or data  
