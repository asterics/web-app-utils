/**
 * @file
 * This Javascript library provides functions that simplify the creation of web-based user interfaces interacting with an AsTeRICS model.
 * The lib provides functions for downloading files from a webserver, widget <-> model synchronization, up/download/start models, setting/getting properties of deployed model.
 *
 * @author Martin Deinhofer
 * @version 0.1
 */

import axios from "axios";
import { startModel, uploadModel, setRuntimeComponentProperties, storeData, setBaseURI as setBase } from "@asterics/are-rest";

//set the base uri (usually where ARE runs at)
export function setBaseURI(uri) {
  setBase(uri);
}

/**
 * Loads a file hosted on the same webserver as this file and returns the contents as plain text.
 * @param {string} relFilePath - The path to the file relative to http://<location.origin>/subpath/.
 * @param {function(fileContentsAsString)} [successCallback=defaultSuccessCallback] - The callback function to be called with the file contents.
 * @param {function(HTTPstatus, errorMessage)} [errorCallback=defaultErrorCallback]- Callback function in case of an error.
 */
export function loadFileFromWebServer(relFilePath, successCallback, errorCallback) {
  //assign default callback functions if none was provided.
  successCallback = getSuccessCallback(successCallback);
  errorCallback = getErrorCallback(errorCallback);

  axios
    .get(relFilePath)
    .then(function(response) {
      console.log("File from Webserver successfully loaded: " + relFilePath);
      successCallback(response.data);
    })
    .catch(function(error) {
      errorCallback(error);
    });
}

/**
 * Deploys a model file hosted on the same webserver as this file to a running ARE instance e.g. on localhost.
 * @param {string} relFilePath - The path to the file relative to http://location.origin/subpath/.
 * @param {function(data, HTTPstatus)} [successCallback=defaultSuccessCallback] - The callback function to be called with the file contents.
 * @param {function(HTTPstatus, errorMessage)} [errorCallback=defaultErrorCallback]- Callback function in case of an error.
 */
export function deployModelFromWebserver(relFilePath, successCallback, errorCallback) {
  //assign default callback functions if none was provided.
  successCallback = getSuccessCallback(successCallback);
  errorCallback = getErrorCallback(errorCallback);

  loadFileFromWebServer(
    relFilePath,
    function(modelInXML) {
      uploadModel(successCallback, errorCallback, modelInXML, true);
    },
    errorCallback
  );
}

/**
 * Deploys a model file hosted on the same webserver as this file to a running ARE instance e.g. on localhost.
 * Additionally applies the property settings in the given propertyMap and if successful starts the model.
 * @param {string} relFilePath - The path to the file relative to http://location.origin/subpath/.
 * @param {string } propertyMap - A JSON string of property keys and values (see function setRuntimeComponentProperties) in the format: 
 
 {
   "Component_id_1":{
      "key_1_1":"val_1_1",
      "key_1_2":"val_1_2"
   },
   "Component_id_2":{
      "key_2_1":"val_2_1",
      "key_2_2":"val_2_2"
   }
}
 * @param {function(data, HTTPstatus)} [successCallback=defaultSuccessCallback] - The callback function to be called with the file contents. 
 * @param {function(HTTPstatus, errorMessage)} [errorCallback=defaultErrorCallback]- Callback function in case of an error. 
 */

export function deployModelFromWebserverApplySettingsAndStartModel(relFilePath = "", propertyMap, successCallback, errorCallback) {
  if (propertyMap === null) propertyMap = {};
  else if (typeof propertyMap === "string") propertyMap = JSON.parse(propertyMap);
  let propertyCount = 0;
  for (let k in propertyMap) {
    propertyCount += Object.keys(propertyMap[k]).length;
  }

  //assign default callback functions if none was provided.
  successCallback = getSuccessCallback(successCallback);
  errorCallback = getErrorCallback(errorCallback);

  deployModelFromWebserver(
    relFilePath,
    function() {
      if (propertyCount > 0) {
        setRuntimeComponentProperties(
          function(data, HTTPstatus) {
            if (data.length !== propertyCount) {
              if (data.length > 0) console.log("Only following properties set successfully: " + data);
              let errorMsg = "Could not set all properties successfully.";
              alert(errorMsg);
            }
            console.log("The following properties could be set: " + data);
            startModel(successCallback, errorCallback);
          },
          errorCallback,
          propertyMap
        );
      } else {
        startModel(successCallback, errorCallback);
      }
    },
    errorCallback
  );
}

/**
 * Stores the file hosted on the same webserver as this file at a running ARE instance e.g. on localhost and the given relFilePathARE.
 * @param {string} relFilePath - The path of the file relative to http://location.origin/subpath/.
 * @param {string} relFilePathARE - The store path of the file on the ARE relative to ARE/data.
 * @param {function(data, HTTPstatus)} [successCallback=defaultSuccessCallback] - The callback function to be called with the file contents.
 * @param {function(HTTPstatus, errorMessage)} [errorCallback=defaultErrorCallback]- Callback function in case of an error.
 */
export function storeFileFromWebserverOnARE(relFilePath, relFilePathARE, successCallback, errorCallback) {
  //assign default callback functions if none was provided.
  successCallback = getSuccessCallback(successCallback);
  errorCallback = getErrorCallback(errorCallback);

  loadFileFromWebServer(
    relFilePath,
    function(fileContentsAsString) {
      storeData(successCallback, errorCallback, relFilePathARE, fileContentsAsString);
    },
    errorCallback
  );
}

/**
 * Returns a valid callback function - either successCallback if != undefined or {defaultSuccessCallback}.
 * @param {function(data, HTTPstatus)} [successCallback=defaultSuccessCallback] - The callback function to be used.
 * @returns {function(data, HTTPstatus)} - Either successCallback or defaultSuccessCallback.
 */

function getSuccessCallback(successCallback) {
  if (typeof successCallback !== "function") {
    return defaultSuccessCallback;
  }
  return successCallback;
}

/**
 * Returns a valid callback function - either errorCallback if != undefined or {defaultErrorCallback}.
 * @param {function(HTTPstatus, errorMessage)} [errorCallback=defaultErrorCallback]- The callback function to be used.
 * @returns {function(HTTPstatus, errorMessage)} - Either errorCallback or defaultErrorCallback.
 */

function getErrorCallback(errorCallback) {
  if (typeof errorCallback !== "function") {
    return defaultErrorCallback;
  }
  return errorCallback;
}

/* generic callback handler */
/**
 * This is the default success callback.
 * By default nothing is done.
 *
 * @callback defaultSuccessCallback
 * @param {data} - response text or message.
 * @param {HTTPstatus} - HTTP status code if applicable.
 */
function defaultSuccessCallback(data, HTTPstatus) {}
/**
 * This is the default error callback. 
 * By default an error dialog (alert) is opened.
 *
 * @callback defaultErrorCallback
 * @param {HTTPstatus} - HTTP status code if applicable.
 * @param {errorMessage} - The error message to be shown.

 */
function defaultErrorCallback(HTTPstatus, errorMessage) {
  alert("An error occured: " + errorMessage + "\nPlease ensure to install AsTeRICS and start the ARE!");
}
