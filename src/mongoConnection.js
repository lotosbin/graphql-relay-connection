/* @flow */
import type {
  ConnectionCursor,
} from './connectionTypes';
import defineConnection from './defineConnection';
import {
  base64,
  unbase64,
  startsWith,
} from './util';
import {ObjectID as ObjectId} from 'mongodb'

export type ID = string;

export type Document = {
  _id: ID,
};

const PREFIX = 'mongo:';


function documentToCursor(doc: Document): ConnectionCursor {
  return base64(PREFIX + doc._id);
}


function cursorToDocument(cursor: ConnectionCursor): ?Document {
  const unbased = unbase64(cursor);
  if (startsWith(unbased, PREFIX)) {
    const id = unbased.substring(PREFIX.length);
    if (id && ObjectId.isValid(id)) {
      return {
        _id: ObjectId.createFromHexString(id),
        id,
      };
    }
  }
  return null;
}


function compareDocuments(doc1: Document, doc2: Document): number {
  if (doc1._id < doc2._id) {
    return -1;
  }
  if (doc1._id > doc2._id) {
    return 1;
  }
  return 0;
}


const {
  connectionFromArray,
  connectionFromPromisedArray,
} = defineConnection({
  comparableToCursor: documentToCursor,
  cursorToComparable: cursorToDocument,
  comparator: compareDocuments,
});


export {
  compareDocuments,
  connectionFromArray,
  connectionFromPromisedArray,
  cursorToDocument,
  documentToCursor,
};

export default {
  compareDocuments,
  connectionFromArray,
  connectionFromPromisedArray,
  cursorToDocument,
  documentToCursor,
};
