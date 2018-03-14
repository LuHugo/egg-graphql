'use strict';

const fs = require('fs');
const path = require('path');

const SYMBOL_CONNECTOR_CLASS = Symbol('Application#connectorClass');

module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/graphql');
  const connectorPath = path.join(basePath, 'connector');
  const files = fs.readdirSync(connectorPath);

  Object.defineProperty(app, 'connectorClass', {
    get() {
      if (!this[SYMBOL_CONNECTOR_CLASS]) {
        const classes = new Map();

        files.forEach(file => {
          let connectorFile = path.join(connectorPath, file);
          let stats = fs.statSync(connectorFile);
          if (stats.isFile()) {
            /* istanbul ignore else */
            const Connector = require(connectorFile);
            classes.set(file.split('.')[0], Connector);
          }
        });

        this[SYMBOL_CONNECTOR_CLASS] = classes;
      }
      return this[SYMBOL_CONNECTOR_CLASS];
    },
  });
};
