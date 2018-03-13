'use strict';

const fs = require('fs');
const path = require('path');

const SYMBOL_CONNECTOR_CLASS = Symbol('Application#connectorClass');

module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/graphql');
  const connectorPaht = path.join(basePath, 'connectors');
  const files = fs.readdirSync(connectorPaht);

  Object.defineProperty(app, 'connectorClass', {
    get() {
      if (!this[SYMBOL_CONNECTOR_CLASS]) {
        const classes = new Map();

        files.forEach(file => {
          let connectorFile = join(path, file);
          let stats = fs.statSync(connectorFile);
          if (stats.isFile()) {
            /* istanbul ignore else */
            const Connector = require(connectorFile);
            classes.set(type, Connector);
          }
        });

        this[SYMBOL_CONNECTOR_CLASS] = classes;
      }
      return this[SYMBOL_CONNECTOR_CLASS];
    },
  });
};
