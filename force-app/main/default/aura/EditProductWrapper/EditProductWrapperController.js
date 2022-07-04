({
    handleFilterChange: function(component, event) {


        var CloseClicked = event.getParam('close');
        component.set('v.message', 'Close Clicked');

        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
})
