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
  const schemaPath = path.join(basePath, 'schema');
  const resolverPath = path.join(basePath, 'resolver');
  const directivePath = path.join(basePath, 'directive');

  const schemaFiles = fs.readdirSync(schemaPath);
  const resolverFiles = fs.readdirSync(resolverPath);
  const directiveFiles = fs.readdirSync(directivePath);

  const schemas = [];
  const resolverMap = {};
  const directiveMap = {};

  // 加载schema
  schemaFiles.forEach(file => {
    let schemaFile = path.join(schemaPath, file);
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
    let resolverFile = path.join(resolverPath, file);
    let stats = fs.statSync(resolverFile);
    if (stats.isFile()) {
      const resolver = require(resolverFile);
      _.merge(resolverMap, resolver);
    }
  });

  // 加载directive
  directiveFiles.forEach(file => {
    let directiveFile = path.join(directivePath, file);
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
