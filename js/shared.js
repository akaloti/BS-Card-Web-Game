"use strict";

/*
  Contains JavaScript that many files need
*/

var shared = {};
shared.PRECONDITION_ERROR = "precondition error";
shared.bs = {};
shared.bs.MAX_NUMBER_OF_PLAYERS = 6;

shared.isUnitTesting = function() {
  return $("#qunit").length === 1;
}

/*
  @pre none
  @post errorMessage printed to console
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