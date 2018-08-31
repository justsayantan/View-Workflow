using Alchemy4Tridion.Plugins.GUI.Configuration;
using Alchemy4Tridion.Plugins.GUI.Configuration.Elements;

namespace ViewWorkflow.GUI
{
    public class ViewWorkflowGroup : Alchemy4Tridion.Plugins.GUI.Configuration.ResourceGroup
    {
        public ViewWorkflowGroup()
        {
            AddFile("ViewWorkflow.js");
            AddFile("ViewWorkflow.css");
            AttachToView("ViewWorkflow.aspx");
            AddWebApiProxy();
            Dependencies.AddLibraryJQuery();
            Dependencies.Add("Tridion.Web.UI.Editors.CME");
            
        }
    }
}
