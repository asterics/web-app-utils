const {
  deployModelFromWebserver,
  deployModelFromWebserverApplySettingsAndStartModel,
  storeFileFromWebserverOnARE,
  applySettingsInXMLModelAndStart
} = require("../dist");

// applySettingsInXMLModelAndStart("https://raw.githubusercontent.com/asterics/AsTeRICS/master/bin/ARE/models/HeadSound.acs", function(data,HTTPStatus){
//   //We now have to manually change the event routes from the swith inputs to the assigned mouse events.
//   function(data,HTTPStatus){
//     triggerEvent(defaultSuccessCallback,defaultErrorCallback,"KeySwitch2EventRouter",$("#switch2Action").val());
//   },defaultErrorCallback,"KeySwitch1EventRouter",$("#switch1Action").val());
// });

let model1 = "https://raw.githubusercontent.com/asterics/AsTeRICS/master/bin/ARE/models/HeadSound.acs";
let model2 = "https://raw.githubusercontent.com/asterics/AsTeRICS/master/bin/ARE/models/XFaceTrackerMouse.acs";
let model3 = "https://raw.githubusercontent.com/asterics/AsTeRICS/master/bin/ARE/models/ImageDemo.acs";

// deployModelFromWebserver(model3,
//   function(data, status) {
//     console.log(data);
//   }, function(status, error) {
//     console.log(error);
//   }
// )

// const prop = JSON.stringify({
//   "Mouse.1": {
//     "enableMouse": "true"
//   },
//   "Slider.1": {
//     "min": "10",
//     "default": "70"
//   }
// });

// deployModelFromWebserverApplySettingsAndStartModel(model2, prop,
//   function(data, status) {
//     console.log(data);
//   }, function(status, error) {
//     console.log(error);
//   }
// )

// storeFileFromWebserverOnARE(model2, "ARE/data/model.acs",
//   function(data, status) {
//     console.log(data);
//   }, function(status, error) {
//     console.log(error);
//   }
// )

applySettingsInXMLModelAndStart(
  model2,
  function(data, status) {
    console.log(data);
  },
  function(status, error) {
    console.log(error);
  }
);
