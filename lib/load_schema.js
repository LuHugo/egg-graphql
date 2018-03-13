'use strict';

const fs = require('fs');
const path = require('path');
const {
  makeExecutableSchema,
} = require('graphql-tools');
const _ = require('lodash');

const SYMBOL_SCHEMA = Symbol('Applicaton#schema');

module.exports = app => {
  const basePath = path.join(app.baseDir, 'app/graphql');
  const schemaPath = path.join(basePath, 'schemas');
  const resolverPath = path.join(basePath, 'resolvers');
  const directivePath = path.join(basePath, 'directives');

  const schemaFiles = fs.readdirSync(schemaPath);
  const resolverFiles = fs.readdirSync(resolverPath);
  const directiveFiles = fs.readdirSync(directivePath);

  const schemas = [];
  const resolverMap = {};
  const directiveMap = {};

  // 加载schema
  schemaFiles.forEach(file => {
    let schemaFile = path.join(path, file);
    let stats = fs.statSync(schemaFile);
    if (stats.isFile()) {
      const schema = fs.readFileSync(schemaFile, {
        encoding: 'utf8',
      });
      schemas.push(schema);
    }
  });

  // 加载resolver
  resolverFiles.forEach(file => {
    let resolverFile = path.join(path, file);
    let stats = fs.statSync(resolverFile);
    if (stats.isFile()) {
      const resolver = require(resolverFile);
      _.merge(resolverMap, resolver);
    }
  });

  // 加载directive
  directiveFiles.forEach(file => {
    let directiveFile = path.join(path, file);
    let stats = fs.statSync(directiveFile);
    if (stats.isFile()) {
      const directive = require(directiveFile);
      _.merge(directiveMap, directive);
    }
  });

  Object.defineProperty(app, 'schema', {
    get() {
      if (!this[SYMBOL_SCHEMA]) {
        this[SYMBOL_SCHEMA] = makeExecutableSchema({
          typeDefs: schemas,
          resolvers: resolverMap,
          directiveResolvers: directiveMap,
        });
      }
      return this[SYMBOL_SCHEMA];
    },
  });
};
