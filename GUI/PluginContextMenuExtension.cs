﻿using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace ViewWorkflow.GUI
{
    public class PluginContextMenuExtension : Alchemy4Tridion.Plugins.GUI.Configuration.ContextMenuExtension
    {
        public PluginContextMenuExtension()
        {
            AssignId = "";

            // Use this property to specify where in the context menu your items will go
            InsertBefore = Constants.ContextMenuIds.MainContextMenu.SendItemLink;
            // Use AddItem() or AddSubMenu() to add items for this context menu

            //       element id      title        command name
            AddItem("Get_Workflow_Detail", "View Workflow", "GetWorkflowDetail");

            // Add a dependency to the resource group that contains the files/commands that this toolbar extension will use.
            Dependencies.Add<PluginResourceGroup>();

            // apply the extension to a specific view.
            Apply.ToView(Constants.Views.DashboardView);
        }
    }
}
