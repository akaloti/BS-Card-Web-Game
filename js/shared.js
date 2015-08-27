"use strict";

/*
  Contains JavaScript that many files need
*/

var shared = {};
shared.PRECONDITION_ERROR = "precondition error";
shared.bs = {};
shared.bs.MIN_NUMBER_OF_PLAYERS = 2;
shared.bs.MAX_NUMBER_OF_PLAYERS = 6;

/*
  @pre none
  @post none
  @hasTest false
  @param none
  @returns true if currently unit testing, false otherwise
  @throws nothing
*/
shared.isUnitTesting = function() {
  return $("#qunit").length === 1;
}

/*
  @pre none
  @post errorMessage has been printed to console
  @hasTest true
  @param errorMessage to print
  @returns constant indicating the precondition error (mostly for unit
  testing purposes)
  @throws nothing
*/
shared.preconditionError = function(errorMessage) {
  console.log(errorMessage);
  return shared.PRECONDITION_ERROR;
}