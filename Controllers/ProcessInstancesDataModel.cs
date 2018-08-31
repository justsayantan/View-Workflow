using System.Collections.Generic;

namespace ViewWorkflow.Controllers
{
    public class ProcessInstancesDataModel
    {
        public string actionTitle { get; set; }
        public string actionType { get; set; }
        public int actionTypeId { get; set; }
        public int actionSequence { get; set; }
        public bool isActive { get; set; }
        public List<ActivitySequence> nextSequences { get; set; }
    }
    public class ActivitySequence
    {
        public int sequenceNumber { get; set; }
    }
}