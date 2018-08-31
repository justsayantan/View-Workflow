
Alchemy.command("${PluginName}", "GetWorkflowDetail", {

    init: function () {


    },

    isEnabled: function (selection) {
        return this.isAvailable(selection);
    },

    isAvailable: function (selection) {
        var item = this._getSelectedItem(selection);
        if (item != null) {
            switch ($models.getItemType(item)) {                
                case $const.ItemType.ACTIVITY_INSTANCE:
                    return true;
            }
        }

        return false;
    },

    execute: function (selection) {       

        var p = this.properties;
        var selectedItem = this._getSelectedItem(selection);
        var url = "${ViewsUrl}ViewWorkflow.aspx#selectedItem=" + selectedItem;
        var parameters = "width=750px, height=750px,resizable=yes,dialog=yes,minimizable=yes,maximizable=yes";
        var args = { popupType: Tridion.Controls.PopupManager.Type.EXTERNAL };

        p.popup = $popupManager.createExternalContentPopup(url, parameters, args);
        $evt.addEventHandler(p.popup, "close", this.getDelegate(this.closePopup));
        p.popup.open();
    },

    closePopup: function () {
        var p = this.properties;
        if (p.popup) {
            p.popup.close();
            p.popup = null;
        }
    },

    _getSelectedItem: function (selection) {
        $assert.isObject(selection);

        switch (selection.getCount()) {
            case 0: return (selection.getParentItemUri) ? selection.getParentItemUri() : null;
            case 1: return selection.getItem(0);
            default: return null;
        }
    },
});