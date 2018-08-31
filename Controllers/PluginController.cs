using Alchemy4Tridion.Plugins;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Script.Serialization;
using Tridion.ContentManager.CoreService.Client;

namespace ViewWorkflow.Controllers
{ 
    [AlchemyRoutePrefix("Service")]
    public class PluginController : AlchemyApiController
    {
        /// // GET /Alchemy/Plugins/{YourPluginName}/api/{YourServiceName}/YourRoute
        /// <summary>
        /// Just a simple example..
        /// </summary>
        /// <returns>A string "Your Response" as the response message.</returns>
        /// <remarks>
        /// All of your action methods must have both a verb attribute as well as the RouteAttribute in
        /// order for the js proxy to work correctly.
        /// </remarks>
        

        [HttpPost]
        [Route("ViewWorkflow")]
        public string ViewWorkflow(GetParameter selectedItem)
        {
            
            ActivityInstanceData activityInstance = Client.Read(selectedItem.ActivityInstanceId, new ReadOptions()) as ActivityInstanceData;
            if (activityInstance != null)
            {
                string currentActivityId = activityInstance.ActivityDefinition.IdRef;
                ProcessInstanceData processInstance = Client.Read(activityInstance.Process.IdRef, new ReadOptions()) as ProcessInstanceData;

                if (processInstance != null)
                {
                    ProcessDefinitionData processDefinition = Client.Read(processInstance.ProcessDefinition.IdRef, new ReadOptions()) as ProcessDefinitionData;

                    ProcessDefinitationDataModel processDefinitationDataModel = new ProcessDefinitationDataModel();
                    if (processDefinition != null)
                    {
                        processDefinitationDataModel.workflowTitle = processDefinition.Title;
                        processDefinitationDataModel.actions = new List<ProcessInstancesDataModel>();
                        List<ActivityDefinitionData> listOfActivities = processDefinition.ActivityDefinitions.ToList();
                        ActivitySequence startActivitySequence = new ActivitySequence { sequenceNumber = 1 };
                        ProcessInstancesDataModel startProcessInstancesDataModel = new ProcessInstancesDataModel
                        {
                            actionTitle = "",
                            actionType = "Start",
                            actionSequence = 0,
                            actionTypeId = 1,               
                            nextSequences = new List<ActivitySequence> { startActivitySequence }
                        };
                        processDefinitationDataModel.actions.Add(startProcessInstancesDataModel);
                        foreach (ActivityDefinitionData activityDefinitionData in processDefinition.ActivityDefinitions)
                        {
                            ProcessInstancesDataModel processInstancesDataModel =
                                new ProcessInstancesDataModel
                                {
                                    actionTitle = activityDefinitionData.Title,
                                    isActive = (activityDefinitionData.Id.Equals(currentActivityId)) ? true : false,
                                    actionSequence =
                                        processDefinition.ActivityDefinitions.ToList().IndexOf(activityDefinitionData) +
                                        1
                                };
                            TridionActivityDefinitionData tridionActivityDefinitionData = Client.Read(activityDefinitionData.Id, new ReadOptions()) as TridionActivityDefinitionData;
                            processInstancesDataModel.nextSequences = new List<ActivitySequence>();
                            if (tridionActivityDefinitionData != null && tridionActivityDefinitionData.Script == "")
                            {
                                if (tridionActivityDefinitionData.NextActivityDefinitions.Count() > 1)
                                {
                                    processInstancesDataModel.actionType = "Manual-Decision";
                                    processInstancesDataModel.actionTypeId = 4;
                                    foreach (var nextActivity in tridionActivityDefinitionData.NextActivityDefinitions)
                                    {
                                        foreach (ActivityDefinitionData item in listOfActivities)
                                        {
                                            if (item.Id.Equals(nextActivity.IdRef))
                                            {
                                                int findIndex = listOfActivities.IndexOf(item) + 1;
                                                ActivitySequence activitySequence =
                                                    new ActivitySequence {sequenceNumber = findIndex};
                                                processInstancesDataModel.nextSequences.Add(activitySequence);
                                                break;
                                            }
                                        }

                                    }
                                }
                                else
                                {
                                    processInstancesDataModel.actionType = "Manual";
                                    processInstancesDataModel.actionTypeId = 3;
                                    ActivitySequence activitySequence =
                                        new ActivitySequence
                                        {
                                            sequenceNumber = processInstancesDataModel.actionSequence + 1
                                        };
                                    processInstancesDataModel.nextSequences.Add(activitySequence);
                                }
                            }
                            else
                            {
                                if (tridionActivityDefinitionData != null && tridionActivityDefinitionData.NextActivityDefinitions.Count() > 1)
                                {
                                    processInstancesDataModel.actionType = "Automatic-Decision";
                                    processInstancesDataModel.actionTypeId = 6;
                                    foreach (var nextActivity in tridionActivityDefinitionData.NextActivityDefinitions)
                                    {
                                        foreach (ActivityDefinitionData item in listOfActivities)
                                        {
                                            if (item.Id.Equals(nextActivity.IdRef))
                                            {
                                                int findIndex = listOfActivities.IndexOf(item) + 1;
                                                ActivitySequence activitySequence =
                                                    new ActivitySequence {sequenceNumber = findIndex};
                                                processInstancesDataModel.nextSequences.Add(activitySequence);
                                                break;
                                            }
                                        }

                                    }

                                }
                                else
                                {
                                    processInstancesDataModel.actionType = "Automatic";
                                    processInstancesDataModel.actionTypeId = 5;
                                    ActivitySequence activitySequence =
                                        new ActivitySequence {sequenceNumber = processInstancesDataModel.actionSequence + 1};
                                    processInstancesDataModel.nextSequences.Add(activitySequence);
                                }
                            }

                            processDefinitationDataModel.actions.Add(processInstancesDataModel);
                        }


                        ProcessInstancesDataModel sendProcessInstancesDataModel = new ProcessInstancesDataModel
                        {
                            actionTitle = "",
                            actionType = "Stop",
                            actionSequence = listOfActivities.Count() + 1,
                            actionTypeId = 2,
                            nextSequences = new List<ActivitySequence>()
                        };
                        processDefinitationDataModel.actions.Add(sendProcessInstancesDataModel);
                    }
                    var jsSerializer = new JavaScriptSerializer();
                    var serializedJson = jsSerializer.Serialize(processDefinitationDataModel);
                    return serializedJson;
                }
            }
            return null;
        }
       
    }
}
