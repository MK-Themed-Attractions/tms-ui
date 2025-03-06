import { useWipStore } from "@/stores/wipStore";
import type { TaskStatus, WipTask } from "@/types/wip";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";

export const useTaskControls = function useTaskControl() {
  const wipStore = useWipStore();
  const { errors } = storeToRefs(wipStore);

  function canStart(status: TaskStatus) {
    return status === "pending" || status === "paused" || status === 'qc-failed';
  }

  function canPause(status: TaskStatus) {
    return status === "ongoing";
  }

  function canFinish(status: TaskStatus) {
    return status === "ongoing" 
  }

  function canAssign(status: TaskStatus) {
    return status !== "ongoing" && status !== "done" && status !== 'qc-passed';
  }

  function isNotDone(status: TaskStatus) {
    return status !== "done" && status !== 'qc-passed';
  }

  function hasWorkers(status: TaskStatus) {
    return status !== "unassigned";
  }

  function showWipToast(success: boolean) {
    if (success) {
      toast.info("Task info", {
        description: "Task successfully started",
      });
    } else {
      toast.error("Task info", {
        description: "Something went wrong while starting the task",
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
    startTask,
    pauseTask,
    finishTask,
    hasWorkers,
  };
};
