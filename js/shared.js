"use strict";

/*
  Contains JavaScript that many files need
*/

var shared = {};
shared.PRECONDITION_ERROR = "precondition error";

shared.isUnitTesting = function() {
  return $("#qunit").length === 1;
}