({
    handleClick : function(component, event, helper) {
        var searchText = component.get('v.searchText');
        var action = component.get('c.getProducts');
        action.setParams({productName: searchText});
        action.setCallback(this, function(response) {
          var state = response.getState();
          if (state === 'SUCCESS') {
            var products = response.getReturnValue();
            sessionStorage.setItem('search--products', JSON.stringify(products));
            var navEvt = $A.get('e.force:navigateToURL');
            navEvt.setParams({url: '/productsearchresult'});
            navEvt.fire();
          }
        });
        $A.enqueueAction(action);
      }
})
