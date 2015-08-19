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