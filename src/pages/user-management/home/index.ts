import type { DataTableColumns } from "@/components/app/data-table";
import type {
  PermissionAttachMicroservicePayload,
  UserPayload,
  UserPermissionAttachPayload,
  UserRoleAttachPayload,
} from "@/types/auth";

export const userDataTableColumns: DataTableColumns[] = [
  {
    key: "email",
    title: "Email",
  },
  {
    key: "full_name",
    title: "Full name",
  },
  {
    key: "id",
    title: "UUID",
  },
  {
    key: "actions",
    title: "",
  },
];

export type UserDataTableDropdownEvent =
  | "edit"
  | "attach-role"
  | "attach-permission"
  | "reset-password"
  | "add";

export type UserDialogFormSubmit = (
  data: UserPayload,
  cb: UserDialogFormSubmitCallback,
) => void;

export type UserDialogFormSubmitWithId = (
  userId: string,
  data: UserPayload,
  cb: UserDialogFormSubmitCallback,
) => void;

export type UserDialogRoleAttachSubmit = (
  userId: string,
  data: UserRoleAttachPayload,
  cb: UserDialogFormSubmitCallback,
) => void;

export type UserDialogPermissionAttachSubmit = (
  userId: string,
  data: UserPermissionAttachPayload,
  cb?: UserDialogFormSubmitCallback,
) => void;

export type UserDialogFormSubmitCallback = (success: boolean) => void;
