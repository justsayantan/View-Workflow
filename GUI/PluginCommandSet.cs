﻿using Alchemy4Tridion.Plugins.GUI.Configuration;

namespace ViewWorkflow.GUI
{
    public class PluginCommandSet : Alchemy4Tridion.Plugins.GUI.Configuration.CommandSet
    {
        public PluginCommandSet()
        {
            // we only need to add the name of our command
            AddCommand("GetWorkflowDetail");
        }
    }
}
