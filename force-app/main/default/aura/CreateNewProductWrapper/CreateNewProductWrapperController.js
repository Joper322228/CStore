({
    handleFilterChange: function(component, event) {


        var CloseClicked = event.getParam('close');
        component.set('v.message', 'Close Clicked');


        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
    },

    redirectToRecord : function (component, event, helper) {

        component.set('v.message', true);
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({tabId: focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });

        var CloseClicked = event.getParam('close');
        console.log(CloseClicked);
        if(CloseClicked != ''){
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
            "recordId": CloseClicked,
            "slideDevName": "detail"
            });
            navEvt.fire();
        }
    },
})
