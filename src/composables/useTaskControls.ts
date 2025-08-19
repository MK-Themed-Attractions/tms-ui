import { useWipStore } from "@/stores/wipStore";
import type { TaskStatus, WipTask } from "@/types/wip";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";

export const useTaskControls = function useTaskControl() {
  const wipStore = useWipStore();
  const { errors } = storeToRefs(wipStore);

  function canStart(status: TaskStatus) {
    return (
      status === "pending" ||
      status === "paused" ||
      status === "qc-failed" ||
      status === "repair"
    );
  }

  function canPause(status: TaskStatus) {
    return status === "ongoing";
  }

  function canReportIncident(status: TaskStatus) {
    return canPause(status) || status === "repair";
  }

  function canFinish(status: TaskStatus) {
    return status === "ongoing";
  }

  function canAssign(status: TaskStatus) {
    return status !== "ongoing" && status !== "done" && status !== "qc-passed";
  }

  function isNotDone(status: TaskStatus) {
    return status !== "done" && status !== "qc-passed";
  }

  function hasWorkers(status: TaskStatus) {
    return status !== "unassigned";
  }
  function hadInspected(status: TaskStatus) {
    return status === "qc-passed" || status === "qc-failed";
  }

  function showWipToast(success: boolean) {
    if (success) {
      toast.info("Task info", {
        description: "Operation completed successfully",
      });
    } else {
      toast.error("Task error", {
        description: "Operation failed, please try again",
      });
    }
  }

  async function startTask(task: WipTask) {
    if (!canStart(task.status)) return false;

    await wipStore.changeTaskStatus(task.id, { status: "start" });

    return !errors.value;
  }
  async function pauseTask(task: WipTask) {
    if (!canPause(task.status)) return false;

    await wipStore.changeTaskStatus(task.id, { status: "pause" });

    return !errors.value;
  }
  async function finishTask(task: WipTask) {
    if (!canFinish(task.status)) return false;

    await wipStore.changeTaskStatus(task.id, { status: "done" });

    return !errors.value;
  }

  return {
    canStart,
    canPause,
    canFinish,
    canAssign,
    isNotDone,
    showWipToast,
    hadInspected,
    startTask,
    pauseTask,
    finishTask,
    hasWorkers,
    canReportIncident,
  };
};
