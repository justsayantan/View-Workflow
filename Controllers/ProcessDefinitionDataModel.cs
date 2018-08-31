using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewWorkflow.Controllers
{
    public class ProcessDefinitationDataModel
    {
        public string workflowTitle { get; set; }
        public List<ProcessInstancesDataModel> actions { get; set; }
        
    }
}
