export type TaskFieldType =
  | "text"
  | "textarea"
  | "dropdown"
  | "pills"
  | "number"
  | "date"
  | "choice";

export type TaskCreationField = {
  id: string;
  label: string;
  type: TaskFieldType;
  typeLabel: string;
  visible: boolean;
  required: boolean;
  isCustom: boolean;
  isSystem: boolean;
  options?: string[];
  order: number;
};

export type TaskCreationTab = {
  id: string;
  label: string;
  fieldIds: string[];
};

export type TaskCreationSettings = {
  fields: TaskCreationField[];
  tabs: TaskCreationTab[];
};

export const DEFAULT_TASK_CREATION_SETTINGS: TaskCreationSettings = {
  fields: [
    {
      id: "title",
      label: "Task Title",
      type: "text",
      typeLabel: "Standard Text Input",
      visible: true,
      required: true,
      isCustom: false,
      isSystem: true,
      order: 0,
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",
      typeLabel: "Rich Text Area",
      visible: true,
      required: false,
      isCustom: false,
      isSystem: true,
      order: 1,
    },
    {
      id: "project_assignment",
      label: "Project Assignment",
      type: "dropdown",
      typeLabel: "Searchable Dropdown",
      visible: true,
      required: true,
      isCustom: false,
      isSystem: true,
      order: 2,
    },
    {
      id: "task_type",
      label: "Task Type",
      type: "pills",
      typeLabel: "Pill Selection",
      visible: true,
      required: false,
      isCustom: false,
      isSystem: true,
      options: ["Dev", "Design", "QA"],
      order: 3,
    },
    {
      id: "cost_center",
      label: "Cost Center",
      type: "number",
      typeLabel: "Numeric Input",
      visible: true,
      required: false,
      isCustom: true,
      isSystem: false,
      order: 4,
    },
  ],
  tabs: [],
};
