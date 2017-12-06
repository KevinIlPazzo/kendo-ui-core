---
title: Gantt Rows expand and Collapse All
description: An example on how to implement a functionality to expand/collapse all tasks
type: how-to
page_title: Implement Expand/Collapse All Tasks on a Button Click | Kendo UI Gantt
slug: gantt-expand-collapse-alltasks
position: 0
tags: kendo, kendoui, gantt, expand, collapse, all, tasks, button, click
ticketid: 1142128
pitsid:
res_type: kb

---

## Environment
<table>
 <tr>
  <td>Product</td>
  <td>Gantt for Progress® Kendo UI®</td>
 </tr>
 <tr>
  <td>Operating System</td>
  <td>Windows 7 64bit</td>
 </tr>
 <tr>
  <td>Browser</td>
  <td>Google Chrome</td>
 </tr>
 <tr>
  <td>Browser Version</td>
  <td>Version 62.0.3202.94 (Official Build) (64-bit)</td>
 </tr>
</table>


## Description

I would like to have a button on the page, which should be able to expand/collapse all tasks in my Gantt.

## Solution

In order to achieve the desired functionality, you should follow the steps below:

1. Add a button on your page and subscribe for its click event.
1. In the click function, you can get a reference to the DataSource of the Gantt (all tasks rendered in it)
1. Implement a loop, in order to iterate through all tasks.
1. Use set("expanded", [true/false]), in order to manage the expanded state

```html

<div id="example">

    <input class="k-button" type="button" value="Expand/Collapse"></input>

    <div id="gantt"></div>

    <script>
        $(document).ready(function() {
            $(".k-button").click(function(e) {
                var tasks = $("#gantt").data("kendoGantt").dataSource.view();
                var shouldExpand = !tasks[0].expanded;
                for (i = 0; i < tasks.length; i++) {

                    tasks[i].set("expanded", shouldExpand)
                }
            })

            var serviceRoot = "https://demos.telerik.com/kendo-ui/service";
            var tasksDataSource = new kendo.data.GanttDataSource({
                transport: {
                    read: {
                        url: serviceRoot + "/GanttTasks",
                        dataType: "jsonp"
                    },
                    update: {
                        url: serviceRoot + "/GanttTasks/Update",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: serviceRoot + "/GanttTasks/Destroy",
                        dataType: "jsonp"
                    },
                    create: {
                        url: serviceRoot + "/GanttTasks/Create",
                        dataType: "jsonp"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read") {
                            return {
                                models: kendo.stringify(options.models || [options])
                            };
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: {
                                from: "ID",
                                type: "number"
                            },
                            orderId: {
                                from: "OrderID",
                                type: "number",
                                validation: {
                                    required: true
                                }
                            },
                            parentId: {
                                from: "ParentID",
                                type: "number",
                                defaultValue: null,
                                validation: {
                                    required: true
                                }
                            },
                            start: {
                                from: "Start",
                                type: "date"
                            },
                            end: {
                                from: "End",
                                type: "date"
                            },
                            title: {
                                from: "Title",
                                defaultValue: "",
                                type: "string"
                            },
                            percentComplete: {
                                from: "PercentComplete",
                                type: "number"
                            },
                            summary: {
                                from: "Summary",
                                type: "boolean"
                            },
                            expanded: {
                                from: "Expanded",
                                type: "boolean",
                                defaultValue: true
                            }
                        }
                    }
                }
            });

            var dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
                transport: {
                    read: {
                        url: serviceRoot + "/GanttDependencies",
                        dataType: "jsonp"
                    },
                    update: {
                        url: serviceRoot + "/GanttDependencies/Update",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: serviceRoot + "/GanttDependencies/Destroy",
                        dataType: "jsonp"
                    },
                    create: {
                        url: serviceRoot + "/GanttDependencies/Create",
                        dataType: "jsonp"
                    },
                    parameterMap: function(options, operation) {
                        if (operation !== "read") {
                            return {
                                models: kendo.stringify(options.models || [options])
                            };
                        }
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: {
                                from: "ID",
                                type: "number"
                            },
                            predecessorId: {
                                from: "PredecessorID",
                                type: "number"
                            },
                            successorId: {
                                from: "SuccessorID",
                                type: "number"
                            },
                            type: {
                                from: "Type",
                                type: "number"
                            }
                        }
                    }
                }
            });

            var gantt = $("#gantt").kendoGantt({
                dataSource: tasksDataSource,
                dependencies: dependenciesDataSource,
                views: [
                    "day",
                    {
                        type: "week",
                        selected: true
                    },
                    "month"
                ],
                columns: [{
                        field: "id",
                        title: "ID",
                        width: 60
                    },
                    {
                        field: "title",
                        title: "Title",
                        editable: true,
                        sortable: true
                    },
                    {
                        field: "start",
                        title: "Start Time",
                        format: "{0:MM/dd/yyyy}",
                        width: 100,
                        editable: true,
                        sortable: true
                    },
                    {
                        field: "end",
                        title: "End Time",
                        format: "{0:MM/dd/yyyy}",
                        width: 100,
                        editable: true,
                        sortable: true
                    }
                ],
                height: 700,

                showWorkHours: false,
                showWorkDays: false,

                snap: false
            }).data("kendoGantt");
        });
    </script>
</div>

```